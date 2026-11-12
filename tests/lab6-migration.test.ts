import { readFile } from "node:fs/promises";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const db = new PGlite();

const ownerId = "00000000-0000-4000-8000-000000000101";
const propertyId = "10000000-0000-4000-8000-000000000101";
const approvedSponsorId = "20000000-0000-4000-8000-000000000101";
const pendingSponsorId = "20000000-0000-4000-8000-000000000102";

beforeAll(async () => {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;

    create schema auth;
    create table auth.users(id uuid primary key);

    create function auth.uid()
    returns uuid
    language sql
    stable
    as $$
      select nullif(
        current_setting('request.jwt.claim.sub', true),
        ''
      )::uuid;
    $$;

    grant usage on schema auth
    to anon, authenticated, service_role;
  `);

  const migrationNames = [
    "20261029140000_exam_schema_persistence.sql",
    "20261029150000_exam_security_hardening.sql",
    "20261103000000_lab5_owner_delete_unapproved.sql",
    "20261112000000_lab6_sponsor_matching.sql",
  ];

  for (const migrationName of migrationNames) {
    const migration = await readFile(
      new URL(
        `../supabase/migrations/${migrationName}`,
        import.meta.url,
      ),
      "utf8",
    );

    await db.exec(
      migration.replace(
        "create extension if not exists pgcrypto;",
        "",
      ),
    );
  }

  await db.exec(`
    insert into auth.users(id)
    values ('${ownerId}');

    insert into public.profiles(id, role)
    values ('${ownerId}', 'property_owner');

    insert into public.properties(
      id,
      owner_id,
      address,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      status,
      postal_code
    )
    values (
      '${propertyId}',
      '${ownerId}',
      'Fictional 90032 property',
      500000,
      3,
      2,
      1400,
      'approved',
      '90032'
    );

    insert into public.sponsors(
      id,
      name,
      tier,
      active_status,
      status,
      placement,
      start_date,
      end_date,
      home_postal_code,
      radius_miles,
      priority,
      daily_impression_cap,
      destination_url,
      description,
      image_path,
      image_alt
    )
    values
    (
      '${approvedSponsorId}',
      'Fictional Approved Sponsor',
      'gold',
      true,
      'APPROVED',
      'PROPERTY_DETAIL',
      '2026-11-01',
      '2026-11-30',
      '90032',
      5,
      10,
      100,
      'https://example.com/sponsor',
      'Fictional sponsor used for testing.',
      '/sponsor-market.svg',
      'Illustration for a fictional sponsor'
    ),
    (
      '${pendingSponsorId}',
      'Fictional Pending Sponsor',
      'platinum',
      true,
      'PENDING',
      null,
      null,
      null,
      null,
      null,
      100,
      null,
      null,
      null,
      null,
      null
    );

    insert into public.sponsor_zip_coverage(
      sponsor_id,
      postal_code,
      distance_miles
    )
    values
      ('${approvedSponsorId}', '90032', 0.4),
      ('${pendingSponsorId}', '90032', 0.1);
  `);
});

afterAll(async () => {
  await db.close();
});

describe("Lab 6 sponsor migration and eligible query", () => {
  it("enables RLS on both new telemetry tables", async () => {
    const result = await db.query<{ relrowsecurity: boolean }>(`
      select relrowsecurity
      from pg_class
      where oid in (
        'sponsor_zip_coverage'::regclass,
        'sponsor_impressions'::regclass
      )
    `);

    expect(result.rows).toHaveLength(2);
    expect(
      result.rows.every((row) => row.relrowsecurity),
    ).toBe(true);
  });

  it("returns only the approved eligible sponsor", async () => {
    const result = await db.query<{
      sponsor_id: string;
      sponsor_name: string;
      tier: string;
      distance_miles: number;
      daily_impressions: bigint;
      priority: number;
    }>(
      `
        select *
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [propertyId, "PROPERTY_DETAIL", "2026-11-12"],
    );

    expect(result.rows).toHaveLength(1);

    const [candidate] = result.rows;

    expect(candidate.sponsor_id).toBe(approvedSponsorId);
    expect(candidate.sponsor_name).toBe(
      "Fictional Approved Sponsor",
    );
    expect(candidate.tier).toBe("gold");
    expect(Number(candidate.distance_miles)).toBe(0.4);
    expect(Number(candidate.daily_impressions)).toBe(0);
    expect(candidate.priority).toBe(10);
  });

  it("does not expose internal eligibility columns", async () => {
    const result = await db.query<Record<string, unknown>>(
      `
        select *
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [propertyId, "PROPERTY_DETAIL", "2026-11-12"],
    );

    const candidate = result.rows[0];

    expect(candidate).not.toHaveProperty("status");
    expect(candidate).not.toHaveProperty("active_status");
    expect(candidate).not.toHaveProperty("start_date");
    expect(candidate).not.toHaveProperty("end_date");
    expect(candidate).not.toHaveProperty(
      "daily_impression_cap",
    );
  });
});