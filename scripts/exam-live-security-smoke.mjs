// Live DEVELOPMENT-project RLS audit. Creates clearly fictional evidence fixtures.
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "EXAM_TEST_EMAIL",
  "EXAM_TEST_PASSWORD",
  "EXAM_OWNER_B_EMAIL",
  "EXAM_OWNER_B_PASSWORD",
  "EXAM_ADMIN_EMAIL",
  "EXAM_ADMIN_PASSWORD",
];

function client(key, token) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}

async function signIn(emailName, passwordName) {
  const authClient = client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await authClient.auth.signInWithPassword({
    email: process.env[emailName],
    password: process.env[passwordName],
  });
  assert.ifError(error);
  assert.ok(data.session, `Sign-in failed for ${emailName}.`);
  return {
    user: data.user,
    db: client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, data.session.access_token),
  };
}

function ok(result, label) {
  assert.ifError(result.error, label);
  return result.data;
}

function deniedOrEmpty(result, label) {
  if (!result.error) assert.equal(result.data?.length ?? 0, 0, label);
}

async function main() {
  for (const name of required) {
    if (!process.env[name]) throw new Error(`Missing ${name}; no audit fixtures were created.`);
  }
  if (process.env.EXAM_RUN_LIVE_RLS !== "yes") {
    throw new Error("Set EXAM_RUN_LIVE_RLS=yes only for the development Supabase project.");
  }

  const anon = client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const service = client(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ownerA = await signIn("EXAM_TEST_EMAIL", "EXAM_TEST_PASSWORD");
  const ownerB = await signIn("EXAM_OWNER_B_EMAIL", "EXAM_OWNER_B_PASSWORD");
  const admin = await signIn("EXAM_ADMIN_EMAIL", "EXAM_ADMIN_PASSWORD");
  const marker = `${Date.now()}`;

  const profiles = ok(
    await admin.db.from("profiles").select("id,role").in("id", [ownerA.user.id, ownerB.user.id, admin.user.id]),
    "Admin must read profiles.",
  );
  assert.equal(profiles.length, 3, "All three audit profiles must exist.");
  assert.equal(profiles.find((row) => row.id === ownerA.user.id)?.role, "property_owner");
  assert.equal(profiles.find((row) => row.id === ownerB.user.id)?.role, "property_owner");
  assert.equal(profiles.find((row) => row.id === admin.user.id)?.role, "admin");

  let draftA = ok(
    await ownerA.db.from("properties").select("*").eq("owner_id", ownerA.user.id).eq("status", "draft").limit(1),
    "Owner A must read their drafts.",
  )[0];
  if (!draftA) {
    draftA = ok(
      await ownerA.db.from("properties").insert({
        owner_id: ownerA.user.id,
        address: `101 Audit A Street ${marker}`,
        price: 310000,
        bedrooms: 2,
        bathrooms: 1.5,
        square_feet: 1100,
        status: "draft",
      }).select().single(),
      "Owner A must insert their own draft.",
    );
  }

  const draftB = ok(
    await ownerB.db.from("properties").insert({
      owner_id: ownerB.user.id,
      address: `202 Audit B Street ${marker}`,
      price: 320000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1400,
      status: "draft",
    }).select().single(),
    "Owner B must insert their own draft.",
  );

  const approved = ok(
    await admin.db.from("properties").insert({
      owner_id: ownerA.user.id,
      address: `303 Approved Audit Avenue ${marker}`,
      price: 450000,
      bedrooms: 3,
      bathrooms: 2.5,
      square_feet: 1800,
      status: "approved",
    }).select().single(),
    "Admin must insert an approved property.",
  );

  const sponsors = ok(
    await admin.db.from("sponsors").insert([
      { name: `Active Audit Sponsor ${marker}`, tier: "gold", active_status: true },
      { name: `Inactive Audit Sponsor ${marker}`, tier: "bronze", active_status: false },
    ]).select(),
    "Admin must insert sponsors.",
  );
  const activeSponsor = sponsors.find((row) => row.active_status);
  const inactiveSponsor = sponsors.find((row) => !row.active_status);
  assert.ok(activeSponsor && inactiveSponsor);

  ok(
    await admin.db.from("property_sponsors").insert([
      { property_id: approved.id, sponsor_id: activeSponsor.id },
      { property_id: approved.id, sponsor_id: inactiveSponsor.id },
    ]).select(),
    "Admin must create sponsor links.",
  );

  const publicProperties = ok(
    await anon.from("properties").select("id,status").in("id", [draftA.id, draftB.id, approved.id]),
    "Anonymous property read must succeed.",
  );
  assert.deepEqual(publicProperties.map((row) => row.id), [approved.id]);

  const publicSponsors = ok(
    await anon.from("sponsors").select("id,active_status").in("id", [activeSponsor.id, inactiveSponsor.id]),
    "Anonymous sponsor read must succeed.",
  );
  assert.deepEqual(publicSponsors.map((row) => row.id), [activeSponsor.id]);

  const publicLinks = ok(
    await anon.from("property_sponsors").select("property_id,sponsor_id").eq("property_id", approved.id),
    "Anonymous sponsor-link read must succeed.",
  );
  assert.deepEqual(publicLinks.map((row) => row.sponsor_id), [activeSponsor.id]);

  const ownUpdate = await ownerA.db.from("properties")
    .update({ price: Number(draftA.price) + 1 }).eq("id", draftA.id).select("id");
  assert.equal(ok(ownUpdate, "Owner A must update their draft.").length, 1);

  deniedOrEmpty(
    await ownerA.db.from("properties").update({ price: Number(approved.price) + 1 }).eq("id", approved.id).select("id"),
    "Owner A must not update an approved property.",
  );
  deniedOrEmpty(
    await ownerA.db.from("properties").update({ price: Number(draftB.price) + 1 }).eq("id", draftB.id).select("id"),
    "Owner A must not update Owner B's draft.",
  );

  const inquiryEmail = `audit+${marker}@example.com`;
  ok(
    await anon.from("inquiries").insert({
      property_id: approved.id,
      inquirer_email: inquiryEmail,
      message: "A fictional live RLS audit inquiry.",
    }),
    "Anonymous inquiry submission must succeed.",
  );
  deniedOrEmpty(
    await anon.from("inquiries").select("id").eq("inquirer_email", inquiryEmail),
    "Anonymous users must not read inquiries.",
  );
  const ownerInquiry = ok(
    await ownerA.db.from("inquiries").select("id,property_id").eq("inquirer_email", inquiryEmail),
    "Owner A inquiry read must succeed.",
  );
  assert.equal(ownerInquiry.length, 1);
  assert.equal(ownerInquiry[0].property_id, approved.id);
  assert.equal(
    ok(
      await ownerB.db.from("inquiries").select("id").eq("inquirer_email", inquiryEmail),
      "Owner B inquiry query must execute.",
    ).length,
    0,
    "Owner B must not see Owner A's inquiry.",
  );

  // Admin read/write coverage across all five tables.
  for (const table of ["profiles", "sponsors", "properties", "property_sponsors", "inquiries"]) {
    ok(await admin.db.from(table).select("*").limit(1), `Admin must read ${table}.`);
  }
  assert.equal(ok(
    await admin.db.from("profiles").update({ role: "admin" }).eq("id", admin.user.id).select("id"),
    "Admin must write profiles.",
  ).length, 1);
  assert.equal(ok(
    await admin.db.from("sponsors").update({ name: activeSponsor.name }).eq("id", activeSponsor.id).select("id"),
    "Admin must write sponsors.",
  ).length, 1);
  assert.equal(ok(
    await admin.db.from("properties").update({ price: approved.price }).eq("id", approved.id).select("id"),
    "Admin must write properties.",
  ).length, 1);
  const adminInquiry = ok(
    await admin.db.from("inquiries").insert({
      property_id: draftB.id,
      inquirer_email: `admin-audit+${marker}@example.com`,
      message: "A fictional administrator audit inquiry.",
    }).select().single(),
    "Admin must write inquiries.",
  );
  ok(await admin.db.from("inquiries").delete().eq("id", adminInquiry.id), "Admin must delete its inquiry fixture.");
  ok(
    await admin.db.from("property_sponsors").insert({ property_id: draftB.id, sponsor_id: activeSponsor.id }),
    "Admin must write property_sponsors.",
  );
  ok(
    await admin.db.from("property_sponsors").delete().eq("property_id", draftB.id).eq("sponsor_id", activeSponsor.id),
    "Admin must delete its sponsor-link fixture.",
  );

  // Trusted service execution must bypass RLS and retain write access.
  for (const table of ["profiles", "sponsors", "properties", "property_sponsors", "inquiries"]) {
    ok(await service.from(table).select("*").limit(1), `Service role must read ${table}.`);
  }
  assert.equal(ok(
    await service.from("profiles").update({ role: "property_owner" }).eq("id", ownerB.user.id).select("id"),
    "Service role must write profiles.",
  ).length, 1);
  assert.equal(ok(
    await service.from("sponsors").update({ name: inactiveSponsor.name }).eq("id", inactiveSponsor.id).select("id"),
    "Service role must write sponsors.",
  ).length, 1);
  assert.equal(ok(
    await service.from("properties").update({ price: draftB.price }).eq("id", draftB.id).select("id"),
    "Service role must write properties.",
  ).length, 1);
  ok(
    await service.from("property_sponsors").insert({ property_id: draftB.id, sponsor_id: inactiveSponsor.id }),
    "Service role must write property_sponsors.",
  );
  ok(
    await service.from("property_sponsors").delete().eq("property_id", draftB.id).eq("sponsor_id", inactiveSponsor.id),
    "Service role must delete its sponsor-link fixture.",
  );
  const serviceInquiry = ok(
    await service.from("inquiries").insert({
      property_id: draftB.id,
      inquirer_email: `service-audit+${marker}@example.com`,
      message: "A fictional trusted-service audit inquiry.",
    }).select().single(),
    "Service role must write inquiries.",
  );
  ok(await service.from("inquiries").delete().eq("id", serviceInquiry.id), "Service role must delete its inquiry fixture.");

  console.log("Live multi-role RLS audit passed.");
  console.log("Approved property:", approved.id);
  console.log("Owner A draft:", draftA.id);
  console.log("Owner B draft:", draftB.id);
  console.log("Active sponsor:", activeSponsor.id);
  console.log("Inactive sponsor:", inactiveSponsor.id);
  console.log("Recorded inquiry:", ownerInquiry[0].id);
  console.log("No passwords, access tokens, or API keys were printed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Live RLS audit failed.");
  process.exitCode = 1;
});
