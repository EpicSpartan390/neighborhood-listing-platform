// Shared development-only setup for seeding and the live role audit.
import { redactSecrets } from "./lab5-audit.mjs";

export class Lab5SetupError extends Error {}

export async function prepareLab5Clients() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY",
    "EXAM_TEST_EMAIL", "EXAM_TEST_PASSWORD", "EXAM_OWNER_B_EMAIL", "EXAM_OWNER_B_PASSWORD",
    "EXAM_ADMIN_EMAIL", "EXAM_ADMIN_PASSWORD",
  ];
  for (const name of required) {
    if (!process.env[name]) throw new Lab5SetupError(`Missing ${name}; no requests sent.`);
  }
  let target;
  try { target = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL); }
  catch { throw new Lab5SetupError("Invalid Supabase URL; no requests sent."); }
  if (target.username || target.password || target.search || target.hash || target.pathname !== "/" ||
      !(target.protocol === "https:" || (target.protocol === "http:" && ["localhost", "127.0.0.1"].includes(target.hostname)))) {
    throw new Lab5SetupError("Use a project HTTPS origin or HTTP loopback origin without embedded credentials.");
  }
  if (process.env.LAB5_CONFIRM_DEVELOPMENT !== target.host) {
    throw new Lab5SetupError("Set LAB5_CONFIRM_DEVELOPMENT to the verified development URL host. No requests sent.");
  }
  const { createClient } = await import("@supabase/supabase-js");
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const tokens = {};
  const users = [];
  for (const [actor, email, password] of [
    ["ownerA", "EXAM_TEST_EMAIL", "EXAM_TEST_PASSWORD"],
    ["ownerB", "EXAM_OWNER_B_EMAIL", "EXAM_OWNER_B_PASSWORD"],
    ["admin", "EXAM_ADMIN_EMAIL", "EXAM_ADMIN_PASSWORD"],
  ]) {
    const auth = createClient(target.href, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
    const { data, error } = await auth.auth.signInWithPassword({ email: process.env[email], password: process.env[password] });
    if (error || !data.user || !data.session) throw new Lab5SetupError("Development account sign-in failed; no fixture writes sent.");
    users.push(data.user.id);
    tokens[actor] = data.session.access_token;
  }
  const service = createClient(target.href, process.env.SUPABASE_SERVICE_ROLE_KEY, options);
  const secrets = [...required.map((key) => process.env[key]), ...Object.values(tokens)];
  const redact = (text) => redactSecrets(text, secrets);

  async function rest(actor, method, table, query = {}, body, { minimal = false } = {}) {
    const key = actor === "service" ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const bearer = actor === "service" ? key : actor === "anon" ? null : tokens[actor];
    if (actor !== "anon" && !bearer) throw new Lab5SetupError("Unknown audit actor.");
    const params = new URLSearchParams(query);
    const path = `/rest/v1/${table}?${params}`;
    const headers = { apikey: key, "Content-Type": "application/json", Prefer: minimal ? "return=minimal" : "return=representation" };
    // No user Authorization header is sent for anon; only the public API key.
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    const response = await fetch(new URL(path, target), { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const raw = await response.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : null; }
    catch { throw new Lab5SetupError("Unexpected non-JSON database response."); }
    return {
      status: response.status, data: response.ok ? parsed : null, error: response.ok ? null : parsed,
      evidence: {
        actor, request: { method, url: `<SUPABASE_URL>${path}`,
          headers: { apikey: actor === "service" ? "<SERVICE_ROLE_KEY>" : "<PUBLIC_API_KEY>", Authorization: bearer ? `Bearer <${actor === "service" ? "SERVICE_ROLE_KEY" : `${actor.toUpperCase()}_ACCESS_TOKEN`}>` : "ABSENT",
            "Content-Type": headers["Content-Type"], Prefer: headers.Prefer },
          ...(body === undefined ? {} : { body }) },
        response: { status: response.status, body: redact(raw) },
      },
    };
  }
  return { users, service, rest, redact };
}
