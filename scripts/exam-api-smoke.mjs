// Manual DEVELOPMENT-project check. Creates one fictional draft after confirmation.
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

async function main() {
  for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "EXAM_TEST_EMAIL", "EXAM_TEST_PASSWORD"]) {
    if (!process.env[name]) throw new Error(`Missing ${name}; no requests were sent.`);
  }
  if (process.env.EXAM_CREATE_DRAFT !== "yes") {
    throw new Error("Set EXAM_CREATE_DRAFT=yes only when ready to create one fictional draft in your development project.");
  }
  const base = new URL(process.env.EXAM_APP_URL ?? "http://localhost:3100");
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password) {
    throw new Error("EXAM_APP_URL must be HTTP(S), without embedded credentials.");
  }
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithPassword({
    email: process.env.EXAM_TEST_EMAIL, password: process.env.EXAM_TEST_PASSWORD,
  });
  if (error || !data.session) throw new Error("Test sign-in failed; check the account. No token or password is printed.");
  const payload = { address: "123 Fictional Exam Street", price: 250000, bedrooms: 2, bathrooms: 1.5, square_feet: 1200 };
  const post = (body, authorized = false) => fetch(new URL("/api/properties", base), {
    method: "POST", headers: {
      "Content-Type": "application/json",
      ...(authorized ? { Authorization: `Bearer ${data.session.access_token}` } : {}),
    }, body: JSON.stringify(body),
  });
  assert.equal((await fetch(new URL("/api/properties", base))).status, 200, "Public GET must return 200.");
  assert.equal((await post({ ...payload, status: "approved" })).status, 400, "Unknown fields must be rejected.");
  assert.equal((await post(payload)).status, 401, "Unsigned creation must return 401.");
  const created = await post(payload, true);
  assert.equal(created.status, 201, "Authenticated owner creation must return 201.");
  const record = (await created.json()).data;
  assert.equal(record.owner_id, data.user.id, "Owner must match the verified user.");
  assert.equal(record.status, "draft", "The stored listing must be a draft.");
  console.log("Owner API smoke checks passed. Created fictional draft:", record.id);
  console.log("Keep or remove that fixture through authorized access after recording your real evidence.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "API smoke check failed.");
  process.exitCode = 1;
});
