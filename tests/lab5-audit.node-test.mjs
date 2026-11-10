import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expectEmpty, expectSqlError, expectUnchanged, redactSecrets } from "../scripts/lib/lab5-audit.mjs";

test("empty-row denial requires a successful request and actual empty array", () => {
  assert.doesNotThrow(() => expectEmpty({ status: 200, data: [], error: null }, "draft"));
  for (const data of [null, {}, [{ id: "exposed" }]]) {
    assert.throws(() => expectEmpty({ status: 200, data, error: null }, "draft"));
  }
});

test("transport/schema/permission errors cannot masquerade as an empty result", () => {
  for (const code of ["FETCH_ERROR", "42P01", "42501"]) {
    assert.throws(() => expectEmpty({ status: 200, data: [], error: { code } }, "draft"));
  }
  assert.throws(() => expectEmpty({ status: 503, data: [], error: null }, "draft"));
});

test("expected SQL denial requires both its exact code and expected HTTP status", () => {
  assert.doesNotThrow(() => expectSqlError({ status: 403, error: { code: "42501" } }, "42501", [401, 403], "owner"));
  for (const response of [
    { status: 403, error: { code: "42P01" } },
    { status: 500, error: { code: "42501" } },
    { status: 200, error: null },
  ]) assert.throws(() => expectSqlError(response, "42501", [401, 403], "owner"));
});

test("constraint rejection is distinguished from RLS rejection", () => {
  const response = { status: 400, error: { code: "23514" } };
  assert.doesNotThrow(() => expectSqlError(response, "23514", [400], "admin"));
  assert.throws(() => expectSqlError(response, "42501", [401, 403], "admin"));
});

test("unchanged-record assertions detect changed or cascade-deleted records", () => {
  const before = { properties: [{ id: "fixture", price: 50 }], inquiries: [{ id: "message" }] };
  assert.doesNotThrow(() => expectUnchanged(before, structuredClone(before), "write"));
  assert.throws(() => expectUnchanged(before, { ...before, inquiries: [] }, "delete"));
  assert.throws(() => expectUnchanged(before, { ...before, properties: [{ id: "fixture", price: 1 }] }, "write"));
});

test("evidence redaction removes credentials while retaining status/body meaning", () => {
  const text = '403 {"code":"42501"} Bearer private-token-example password-example';
  const cleaned = redactSecrets(text, ["private-token-example", "password-example", "", "private-token"]);
  assert.ok(!cleaned.includes("private-token"));
  assert.ok(!cleaned.includes("password-example"));
  assert.match(cleaned, /403.*42501/);
});

test("live audit refuses to run without its explicit live mode", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("../scripts/lab5-rls-audit.mjs", import.meta.url))], { encoding: "utf8", env: {} });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires --run/);
});
