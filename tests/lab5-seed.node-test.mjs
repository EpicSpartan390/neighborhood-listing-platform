import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildLab5Fixtures, checkExistingSeedRows } from "../scripts/lib/lab5-fixtures.mjs";

const accounts = [1, 2, 3].map((n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`);

test("seed refuses missing Auth identifiers and accounts reused for conflicting roles", () => {
  assert.throws(() => buildLab5Fixtures("<OWNER_A>", accounts[1], accounts[2]), /Auth user UUIDs/);
  assert.throws(() => buildLab5Fixtures(accounts[0], accounts[0], accounts[2]), /different accounts/);
});

test("preflight refuses changing an existing user's role", () => {
  const seed = buildLab5Fixtures(...accounts);
  assert.throws(() => checkExistingSeedRows("profiles", [{ id: accounts[0], role: "admin" }], seed.profiles), /mismatch/);
});

test("preflight refuses replacing unrelated property or inquiry data", () => {
  const seed = buildLab5Fixtures(...accounts);
  assert.throws(() => checkExistingSeedRows("properties", [{ ...seed.properties[0], owner_id: accounts[1] }], seed.properties), /collision/);
  assert.throws(() => checkExistingSeedRows("inquiries", [{ ...seed.inquiries[0], message: "Actual unrelated message" }], seed.inquiries), /collision/);
});

test("known fixtures can be restored after a role test changes mutable state", () => {
  const seed = buildLab5Fixtures(...accounts);
  assert.doesNotThrow(() => checkExistingSeedRows("properties", [{ ...seed.properties[0], price: 400000 }], seed.properties));
});

test("offline preview runs without credentials or installed Supabase dependencies", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("../scripts/lab5-seed.mjs", import.meta.url)), "--dry-run"], { encoding: "utf8", env: {} });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /OFFLINE PREVIEW/);
  assert.match(result.stdout, /"properties": 5/);
});

test("apply without configuration fails before SDK loading or any network requests", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("../scripts/lab5-seed.mjs", import.meta.url)), "--apply"], { encoding: "utf8", env: {} });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no requests sent/);
});
