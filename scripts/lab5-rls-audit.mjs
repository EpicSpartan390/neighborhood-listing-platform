// LIVE development audit: mutates only checked Lab 5 fixtures, then restores them.
import assert from "node:assert/strict";
import { existsSync, writeFileSync } from "node:fs";
import { buildLab5Fixtures, fixtureIds } from "./lib/lab5-fixtures.mjs";
import { expectRows, expectEmpty, expectSqlError, expectUnchanged } from "./lib/lab5-audit.mjs";
import { prepareLab5Clients, Lab5SetupError } from "./lib/lab5-clients.mjs";

const output = new URL("../docs/lab5-live-evidence.json", import.meta.url);
const inquiryProbeId = "50000000-0000-4000-8000-000000000029";
const probeId = "50000000-0000-4000-8000-000000000099";
const report = { startedAt: new Date().toISOString(), completed: false, checks: [], cleanup: "not needed" };
let context;

async function main() {
  if (process.argv.length !== 3 || process.argv[2] !== "--run") {
    throw new Lab5SetupError("Live audit requires --run and a confirmed development target; use offline Node tests first.");
  }
  if (existsSync(output)) throw new Lab5SetupError("Existing live evidence is preserved. Archive it before another live run.");
  context = await prepareLab5Clients();
  const { rest, users } = context;
  const fixtures = buildLab5Fixtures(...users);
  const propertyIds = fixtures.properties.map((row) => row.id).concat(probeId);
  const columns = {
    profiles: "id,role,created_at", sponsors: "id,name,tier,active_status,created_at",
    properties: "id,owner_id,address,price,bedrooms,bathrooms,square_feet,status,created_at",
    property_sponsors: "property_id,sponsor_id", inquiries: "id,property_id,inquirer_email,message,created_at",
  };
  function query(table) {
    const isChild = ["property_sponsors", "inquiries"].includes(table);
    const ids = table === "profiles" ? users : table === "sponsors" ? fixtures.sponsors.map((row) => row.id) : propertyIds;
    return { select: columns[table], [isChild ? "property_id" : "id"]: `in.(${ids.join(",")})`, order: table === "property_sponsors" ? "property_id,sponsor_id" : "id" };
  }
  async function snapshot(actor = "service") {
    const state = {};
    for (const table of Object.keys(columns)) state[table] = expectRows(await rest(actor, "GET", table, query(table)), `Snapshot ${table}`);
    return state;
  }
  const original = await snapshot();
  // Refuse to manipulate unexpected records attached to our reserved fixture IDs.
  for (const [table, rows] of Object.entries(fixtures)) {
    assert.equal(original[table].length, rows.length, `Seed required or unexpected attached records in ${table}`);
    for (const row of rows) {
      const actual = original[table].find((item) => table === "property_sponsors"
        ? item.property_id === row.property_id && item.sponsor_id === row.sponsor_id : item.id === row.id);
      assert.ok(actual, `Missing fixture in ${table}`);
      for (const [key, value] of Object.entries(row)) assert.deepEqual(actual[key], value, `Seed state mismatch in ${table}`);
    }
  }

  async function run(label, action) {
    const check = { label, passed: false, exchanges: [] };
    report.checks.push(check);
    const request = async (...args) => {
      const result = await rest(...args);
      check.exchanges.push(result.evidence);
      return result;
    };
    await action(request);
    check.passed = true;
  }
  async function unchangedWrite(label, actor, method, body, id, expectedCode) {
    await run(label, async (request) => {
      const before = await snapshot();
      const result = await request(actor, method, "properties", { id: `eq.${id}`, select: columns.properties }, body);
      if (expectedCode) expectSqlError(result, expectedCode, expectedCode === "23514" ? [400] : [401, 403], label);
      else expectEmpty(result, label);
      const after = await snapshot();
      report.checks.at(-1).protectedState = { before, after };
      expectUnchanged(before, after, label);
    });
  }
  async function restore() {
    // The reserved probe did not exist at preflight. Remove it if an insecure
    // policy unexpectedly allowed the anonymous insert, then restore snapshots.
    const removed = await rest("service", "DELETE", "properties", { id: `eq.${probeId}`, select: "id" });
    expectRows(removed, "Probe cleanup");
    expectRows(await rest("service", "DELETE", "inquiries", { id: `eq.${inquiryProbeId}`, select: "id" }), "Inquiry cleanup");
    for (const table of Object.keys(columns)) {
      const result = await context.service.from(table).upsert(original[table], {
        onConflict: table === "property_sponsors" ? "property_id,sponsor_id" : "id",
      });
      if (result.error) throw new Error(`Fixture restoration failed for ${table}`);
    }
    expectUnchanged(original, await snapshot(), "Fixture restoration");
  }

  try {
    await run("Anonymous reads only the approved fixture", async (request) => {
      const rows = expectRows(await request("anon", "GET", "properties", query("properties")), "Anonymous properties");
      assert.deepEqual(rows.map((row) => row.id), [fixtureIds.approvedA]);
    });
    await run("Anonymous cannot read a known draft", async (request) => {
      expectEmpty(await request("anon", "GET", "properties", { select: "id,status", id: `eq.${fixtureIds.draftA}` }), "Anonymous draft");
    });
    await run("Other authenticated user cannot read Owner A draft", async (request) => {
      expectEmpty(await request("ownerB", "GET", "properties", { select: "id,status", id: `eq.${fixtureIds.draftA}` }), "Other-user draft");
    });
    await run("Other user can read the approved listing and their own draft", async (request) => {
      const rows = expectRows(await request("ownerB", "GET", "properties", query("properties")), "Other-user permitted read");
      assert.deepEqual(rows.map((row) => row.id).sort(), [fixtureIds.approvedA, fixtureIds.draftB].sort());
    });
    await run("Anonymous sees only active sponsors and public links", async (request) => {
      const sponsors = expectRows(await request("anon", "GET", "sponsors", query("sponsors")), "Public sponsors");
      assert.deepEqual(sponsors.map((row) => row.id), [fixtureIds.activeSponsor]);
      const links = expectRows(await request("anon", "GET", "property_sponsors", query("property_sponsors")), "Public links");
      assert.deepEqual(links, [{ property_id: fixtureIds.approvedA, sponsor_id: fixtureIds.activeSponsor }]);
    });
    await run("Owner can read and update their draft", async (request) => {
      const rows = expectRows(await request("ownerA", "PATCH", "properties", { id: `eq.${fixtureIds.draftA}`, select: "id,price" }, { price: 350001 }), "Owner draft update");
      assert.deepEqual(rows, [{ id: fixtureIds.draftA, price: 350001 }]);
      const stored = expectRows(await rest("service", "GET", "properties", { id: `eq.${fixtureIds.draftA}`, select: "price" }), "Stored owner update");
      assert.equal(stored[0]?.price, 350001);
    });
    await unchangedWrite("Other user cannot update Owner A draft", "ownerB", "PATCH", { price: 999 }, fixtureIds.draftA);
    await unchangedWrite("Owner cannot reassign their draft", "ownerA", "PATCH", { owner_id: users[1] }, fixtureIds.draftA, "42501");
    await unchangedWrite("Owner cannot self-approve their draft", "ownerA", "PATCH", { status: "approved" }, fixtureIds.draftA, "42501");
    for (const [label, id] of [["approved", fixtureIds.approvedA], ["pending", fixtureIds.pendingA]]) {
      await unchangedWrite(`Owner cannot update ${label} listing`, "ownerA", "PATCH", { price: 999 }, id);
      await unchangedWrite(`Owner cannot delete ${label} listing`, "ownerA", "DELETE", undefined, id);
    }
    await unchangedWrite("Other user cannot delete Owner A draft", "ownerB", "DELETE", undefined, fixtureIds.draftA);
    await run("Ordinary user cannot promote their profile", async (request) => {
      const before = await snapshot();
      expectEmpty(await request("ownerB", "PATCH", "profiles", { id: `eq.${users[1]}`, select: "id,role" }, { role: "admin" }), "Role escalation");
      expectUnchanged(before, await snapshot(), "Role escalation");
    });
    await run("Anonymous property insertion is denied", async (request) => {
      const before = await snapshot();
      const result = await request("anon", "POST", "properties", {}, { ...fixtures.properties[0], id: probeId }, { minimal: true });
      expectSqlError(result, "42501", [401, 403], "Anonymous insert");
      expectUnchanged(before, await snapshot(), "Anonymous insert");
    });
    await run("Anonymous cannot read inquiries; owners remain isolated", async (request) => {
      expectSqlError(await request("anon", "GET", "inquiries", query("inquiries")), "42501", [401, 403], "Inquiry grant");
      for (const [actor, id] of [["ownerA", fixtureIds.inquiryA], ["ownerB", fixtureIds.inquiryB]]) {
        const rows = expectRows(await request(actor, "GET", "inquiries", query("inquiries")), "Owner inquiries");
        assert.deepEqual(rows.map((row) => row.id), [id]);
      }
    });
    await run("Anonymous may submit a fictional inquiry without reading it", async (request) => {
      const body = { id: inquiryProbeId, property_id: fixtureIds.approvedA, inquirer_email: "lab5-probe@example.com", message: "Lab 5 fictional anonymous submission test." };
      const result = await request("anon", "POST", "inquiries", {}, body, { minimal: true });
      assert.equal(result.status, 201, "Inquiry submission must succeed");
      assert.equal(result.error, null);
      const rows = expectRows(await rest("service", "GET", "inquiries", { id: `eq.${inquiryProbeId}`, select: "id,property_id,inquirer_email,message" }), "Stored inquiry");
      assert.deepEqual(rows, [body]);
    });
    await run("Authenticated admin reads all five fixture tables", async () => {
      expectUnchanged(await snapshot(), await snapshot("admin"), "Admin reads");
    });
    await run("Authenticated admin can edit approved property", async (request) => {
      const rows = expectRows(await request("admin", "PATCH", "properties", { id: `eq.${fixtureIds.approvedA}`, select: "id,price" }, { price: 350002 }), "Admin edit");
      assert.deepEqual(rows, [{ id: fixtureIds.approvedA, price: 350002 }]);
    });
    await unchangedWrite("Administrator still obeys price CHECK constraint", "admin", "PATCH", { price: -1 }, fixtureIds.approvedA, "23514");
    await unchangedWrite("Service bypasses RLS but still obeys price CHECK constraint", "service", "PATCH", { price: -1 }, fixtureIds.approvedA, "23514");
    await run("Owner can delete their rejected fixture", async (request) => {
      const rows = expectRows(await request("ownerA", "DELETE", "properties", { id: `eq.${fixtureIds.rejectedA}`, select: "id" }), "Owner delete");
      assert.deepEqual(rows, [{ id: fixtureIds.rejectedA }]);
      expectEmpty(await rest("service", "GET", "properties", { id: `eq.${fixtureIds.rejectedA}`, select: "id" }), "Stored deletion");
    });
    report.completed = true;
  } finally {
    try { await restore(); report.cleanup = "original fictional records restored and verified"; }
    catch { report.completed = false; report.cleanup = "FAILED; inspect fictional records before retrying"; }
    report.finishedAt = new Date().toISOString();
    writeFileSync(output, context.redact(JSON.stringify(report, null, 2)), { flag: "wx" });
  }
  if (!report.completed) throw new Error("Audit or cleanup failed; inspect the local evidence file.");
  console.log(`Live checks passed: ${report.checks.length}. Evidence: docs/lab5-live-evidence.json`);
  console.log("These are database REST checks. App route and browser checks are separate.");
}

main().catch((error) => {
  // Avoid echoing raw auth/SDK exceptions or credential values.
  console.error(error instanceof Lab5SetupError ? error.message : `Live audit did not pass at ${report.checks.at(-1)?.label ?? "setup/preflight"}. Check any saved redacted evidence and fixture state before retrying.`);
  process.exitCode = 1;
});
