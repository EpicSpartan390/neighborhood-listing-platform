// Offline-testable assertions. Empty results and SQL errors are distinct outcomes.
import assert from "node:assert/strict";

export function expectRows(result, label) {
  assert.equal(result.status, 200, `${label}: expected HTTP 200`);
  assert.equal(result.error, null, `${label}: unexpected database/transport error`);
  assert.ok(Array.isArray(result.data), `${label}: expected an array`);
  return result.data;
}

export function expectEmpty(result, label) {
  assert.deepEqual(expectRows(result, label), [], `${label}: protected rows were returned`);
}

export function expectSqlError(result, code, statuses, label) {
  assert.ok(statuses.includes(result.status), `${label}: unexpected HTTP status`);
  assert.equal(result.error?.code, code, `${label}: unexpected error code`);
}

export function expectUnchanged(before, after, label) {
  assert.deepEqual(after, before, `${label}: protected records changed`);
}

export function redactSecrets(value, secrets) {
  let text = String(value);
  for (const secret of [...new Set(secrets)].filter(Boolean).sort((a, b) => b.length - a.length)) {
    text = text.split(secret).join("<REDACTED>");
  }
  return text;
}
