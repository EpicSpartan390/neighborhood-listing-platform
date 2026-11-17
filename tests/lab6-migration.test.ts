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
    "20261116000000_lab6_adversarial_hardening.sql",
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
describe("Lab 6 required eligibility edge cases", () => {
  it("returns an exact ZIP match", async () => {
    const result = await db.query<{
      sponsor_id: string;
      distance_miles: number;
    }>(
      `
        select sponsor_id, distance_miles
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [propertyId, "PROPERTY_DETAIL", "2026-11-12"],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].sponsor_id).toBe(
      approvedSponsorId,
    );
    expect(
      Number(result.rows[0].distance_miles),
    ).toBe(0.4);
  });

  it("returns a nearby ZIP within the approved radius", async () => {
    const nearbyPropertyId =
      "10000000-0000-4000-8000-000000000102";

    await db.exec(`
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
        '${nearbyPropertyId}',
        '${ownerId}',
        'Fictional nearby property',
        450000,
        2,
        1,
        1000,
        'approved',
        '90031'
      );

      insert into public.sponsor_zip_coverage(
        sponsor_id,
        postal_code,
        distance_miles
      )
      values (
        '${approvedSponsorId}',
        '90031',
        2.2
      );
    `);

    const result = await db.query<{
      sponsor_id: string;
      distance_miles: number;
    }>(
      `
        select sponsor_id, distance_miles
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [
        nearbyPropertyId,
        "PROPERTY_DETAIL",
        "2026-11-12",
      ],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].sponsor_id).toBe(
      approvedSponsorId,
    );
    expect(
      Number(result.rows[0].distance_miles),
    ).toBe(2.2);
  });

  it("excludes an inactive sponsor", async () => {
    const inactiveSponsorId =
      "20000000-0000-4000-8000-000000000103";

    await db.exec(`
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
        destination_url,
        image_alt
      )
      values (
        '${inactiveSponsorId}',
        'Fictional Inactive Sponsor',
        'platinum',
        false,
        'APPROVED',
        'PROPERTY_DETAIL',
        '2026-11-01',
        '2026-11-30',
        '90032',
        5,
        100,
        'https://example.com/inactive',
        'Illustration for an inactive fictional sponsor'
      );

      insert into public.sponsor_zip_coverage(
        sponsor_id,
        postal_code,
        distance_miles
      )
      values (
        '${inactiveSponsorId}',
        '90032',
        0.1
      );
    `);

    const result = await db.query<{
      sponsor_id: string;
    }>(
      `
        select sponsor_id
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [propertyId, "PROPERTY_DETAIL", "2026-11-12"],
    );

    expect(
      result.rows.some(
        (row) => row.sponsor_id === inactiveSponsorId,
      ),
    ).toBe(false);
  });

  it("excludes an expired campaign", async () => {
    const expiredSponsorId =
      "20000000-0000-4000-8000-000000000104";

    await db.exec(`
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
        destination_url,
        image_alt
      )
      values (
        '${expiredSponsorId}',
        'Fictional Expired Sponsor',
        'platinum',
        true,
        'APPROVED',
        'PROPERTY_DETAIL',
        '2026-10-01',
        '2026-11-10',
        '90032',
        5,
        100,
        'https://example.com/expired',
        'Illustration for an expired fictional sponsor'
      );

      insert into public.sponsor_zip_coverage(
        sponsor_id,
        postal_code,
        distance_miles
      )
      values (
        '${expiredSponsorId}',
        '90032',
        0.1
      );
    `);

    const result = await db.query<{
      sponsor_id: string;
    }>(
      `
        select sponsor_id
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [propertyId, "PROPERTY_DETAIL", "2026-11-12"],
    );

    expect(
      result.rows.some(
        (row) => row.sponsor_id === expiredSponsorId,
      ),
    ).toBe(false);
  });

  it("returns no candidate when ZIP coverage is absent", async () => {
    const unmatchedPropertyId =
      "10000000-0000-4000-8000-000000000103";

    await db.exec(`
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
        '${unmatchedPropertyId}',
        '${ownerId}',
        'Fictional unmatched property',
        300000,
        1,
        1,
        800,
        'approved',
        '99999'
      );
    `);

    const result = await db.query(
      `
        select sponsor_id
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [
        unmatchedPropertyId,
        "PROPERTY_DETAIL",
        "2026-11-12",
      ],
    );

    expect(result.rows).toHaveLength(0);
  });
});

describe("Lab 6 adversarial database boundaries", () => {
  async function eligibleIds(
    selectedPropertyId: string,
    onDate: string,
  ) {
    const result = await db.query<{
      sponsor_id: string;
    }>(
      `
        select sponsor_id
        from public.get_eligible_sponsors($1, $2, $3)
      `,
      [
        selectedPropertyId,
        "PROPERTY_DETAIL",
        onDate,
      ],
    );

    return result.rows.map(
      (row) => row.sponsor_id,
    );
  }

  async function addApprovedSponsor({
    id,
    startDate,
    endDate,
    radius,
    distance,
    postalCode = "90032",
  }: {
    id: string;
    startDate: string;
    endDate: string;
    radius: number;
    distance: number;
    postalCode?: string;
  }) {
    await db.exec(`
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
        destination_url,
        image_alt
      )
      values (
        '${id}',
        'Fictional Adversarial Sponsor',
        'gold',
        true,
        'APPROVED',
        'PROPERTY_DETAIL',
        '${startDate}',
        '${endDate}',
        '${postalCode}',
        ${radius},
        10,
        'https://example.com/adversarial',
        'Illustration for an adversarial sponsor'
      );

      insert into public.sponsor_zip_coverage(
        sponsor_id,
        postal_code,
        distance_miles
      )
      values (
        '${id}',
        '${postalCode}',
        ${distance}
      );
    `);
  }

  it("includes both exact campaign date boundaries", async () => {
    expect(
      await eligibleIds(propertyId, "2026-11-01"),
    ).toContain(approvedSponsorId);

    expect(
      await eligibleIds(propertyId, "2026-11-30"),
    ).toContain(approvedSponsorId);
  });

  it("excludes a campaign that starts tomorrow", async () => {
    const futureId =
      "20000000-0000-4000-8000-000000000105";

    await addApprovedSponsor({
      id: futureId,
      startDate: "2026-11-17",
      endDate: "2026-11-30",
      radius: 5,
      distance: 0.1,
    });

    expect(
      await eligibleIds(propertyId, "2026-11-16"),
    ).not.toContain(futureId);
  });

  it("includes exact radius and excludes over radius", async () => {
    const boundaryId =
      "20000000-0000-4000-8000-000000000106";
    const overRadiusId =
      "20000000-0000-4000-8000-000000000107";

    await addApprovedSponsor({
      id: boundaryId,
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      radius: 5,
      distance: 5,
    });

    await addApprovedSponsor({
      id: overRadiusId,
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      radius: 5,
      distance: 5.01,
    });

    const ids = await eligibleIds(
      propertyId,
      "2026-11-16",
    );

    expect(ids).toContain(boundaryId);
    expect(ids).not.toContain(overRadiusId);
  });

  it("excludes a sponsor exactly at its daily cap", async () => {
    await db.exec(`
      insert into public.sponsor_impressions(
        sponsor_id,
        placement,
        occurred_at,
        page_context
      )
      select
        '${approvedSponsorId}',
        'PROPERTY_DETAIL',
        '2026-11-12 12:00:00+00',
        'property_detail'
      from generate_series(1, 99);
    `);

    expect(
      await eligibleIds(propertyId, "2026-11-12"),
    ).toContain(approvedSponsorId);

    await db.exec(`
      insert into public.sponsor_impressions(
        sponsor_id,
        placement,
        occurred_at,
        page_context
      )
      values (
        '${approvedSponsorId}',
        'PROPERTY_DETAIL',
        '2026-11-12 12:01:00+00',
        'property_detail'
      );
    `);

    expect(
      await eligibleIds(propertyId, "2026-11-12"),
    ).not.toContain(approvedSponsorId);
  });

  it("preserves a leading-zero ZIP code", async () => {
    const leadingZeroPropertyId =
      "10000000-0000-4000-8000-000000000104";

    await db.exec(`
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
        '${leadingZeroPropertyId}',
        '${ownerId}',
        'Fictional leading-zero ZIP property',
        350000,
        2,
        1,
        900,
        'approved',
        '02138'
      );

      insert into public.sponsor_zip_coverage(
        sponsor_id,
        postal_code,
        distance_miles
      )
      values (
        '${approvedSponsorId}',
        '02138',
        1.5
      );
    `);

    expect(
      await eligibleIds(
        leadingZeroPropertyId,
        "2026-11-13",
      ),
    ).toContain(approvedSponsorId);
  });

  it("rejects an inverted campaign date range", async () => {
    await expect(
      db.exec(`
        insert into public.sponsors(
          id,
          name,
          tier,
          start_date,
          end_date
        )
        values (
          '20000000-0000-4000-8000-000000000108',
          'Fictional Inverted Date Sponsor',
          'bronze',
          '2026-12-01',
          '2026-11-01'
        );
      `),
    ).rejects.toThrow();
  });
});

describe("Lab 6 function permission hardening", () => {
  it("denies anonymous arbitrary-date eligibility queries", async () => {
    await db.exec("begin");

    try {
      await db.exec("set local role anon");

      await expect(
        db.query(
          `
            select *
            from public.get_eligible_sponsors(
              $1,
              $2,
              $3
            )
          `,
          [
            propertyId,
            "PROPERTY_DETAIL",
            "2099-01-01",
          ],
        ),
      ).rejects.toThrow();
    } finally {
      await db.exec("rollback");
    }
  });

  it("allows the anonymous current-date wrapper", async () => {
    await db.exec("begin");

    try {
      await db.exec("set local role anon");

      const result = await db.query(
        `
          select *
          from public.get_current_eligible_sponsors(
            $1,
            $2
          )
        `,
        [propertyId, "PROPERTY_DETAIL"],
      );

      expect(Array.isArray(result.rows)).toBe(true);
    } finally {
      await db.exec("rollback");
    }
  });
});