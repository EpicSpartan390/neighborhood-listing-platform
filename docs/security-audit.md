# Row-Level Security Audit

This document contains the required authorization matrix and the procedure for producing genuine test evidence. Do not change an expected result to `PASS (verified)` until the test has been executed against the submitted Supabase project.

## Authorization matrix

| Actor | Operation | Expected result | Verified result / evidence |
| :--- | :--- | :--- | :--- |
| Anonymous | Select an approved property | PASS | PASS verified 2026-11-02: the anonymous client returned the approved fixture and excluded both owner drafts. |
| Anonymous | Select a draft property | FAIL / zero rows | PASS verified 2026-11-02: public GET returned zero rows after an authenticated owner draft was created. |
| Anonymous | Select an active sponsor | PASS | PASS verified 2026-11-02: the anonymous client returned active sponsor 12165ce6-b811-4156-bd63-948c570dc694. |
| Anonymous | Select an inactive sponsor | FAIL / zero rows | PASS verified 2026-11-02: the anonymous client excluded inactive sponsor 42e90b46-4315-4248-a280-200eff4c4ce4. |
| Owner A | Insert a draft owned by Owner A | PASS | PASS verified 2026-11-02: authenticated API returned HTTP 201 and created draft b9df51e0-9a38-4af0-a6c5-e343a6469d5c with the authenticated owner ID. |
| Owner A | Update Owner A's draft listing | PASS | PASS verified 2026-11-02: Owner A updated draft b9df51e0-9a38-4af0-a6c5-e343a6469d5c. |
| Owner A | Update Owner A's approved listing | FAIL / denied | PASS verified 2026-11-02: the attempted owner update affected zero approved rows. |
| Owner A | Update Owner B's listing | FAIL / denied | PASS verified 2026-11-02: the cross-owner update affected zero rows. |
| Anonymous/inquirer | Insert a valid inquiry | PASS | PASS verified 2026-11-02: the anonymous client inserted fictional inquiry c46428e5-c85e-4a8c-81fb-788a26aeeedc. |
| Anonymous/inquirer | Select existing inquiries | FAIL / zero rows | PASS verified 2026-11-02: anonymous inquiry selection was denied or returned no readable rows. |
| Property owner | Select inquiries for their property | PASS | PASS verified 2026-11-02: Owner A read the inquiry linked to Owner A's approved property. |
| Property owner | Select inquiries for another owner's property | FAIL / zero rows | PASS verified 2026-11-02: Owner B received zero rows for Owner A's inquiry. |
| Admin profile | Read/write across all five tables | PASS | PASS verified 2026-11-02: the authenticated admin read and wrote profiles, sponsors, properties, property_sponsors, and inquiries. |
| Trusted service role | Read/write across all five tables | PASS | PASS verified 2026-11-02: the server-only client read and wrote all five tables without printing its credential. |

## Live verification procedure

1. Apply `supabase/migrations/20261029140000_exam_schema_persistence.sql` to a development Supabase project.
2. Create test users for Admin, Owner A, and Owner B in Supabase Authentication.
3. Insert corresponding `profiles` rows as the service role or from the SQL editor.
4. Seed one approved property, one Owner A draft, one Owner B draft, an active sponsor, an inactive sponsor, sponsor links, and an inquiry.
5. For each actor, sign in through the application or use that actor's JWT with the Supabase client. Never simulate users by running every check as `postgres` or the service role; those roles bypass RLS.
6. Perform every matrix operation, record the returned rows/error, and replace the pending cell with the date, result, and concise evidence.
7. Capture screenshots or terminal output for the Canvas submission if the instructor expects execution evidence.

## Important interpretation

- A denied `SELECT` normally returns zero rows instead of throwing an error.
- A denied `INSERT`, `UPDATE`, or `DELETE` normally returns an RLS policy error or affects zero rows.
- The service-role credential bypasses RLS. It demonstrates trusted server access, not the correctness of ordinary-user policies.
- Browser developer tools must never show `SUPABASE_SERVICE_ROLE_KEY` in source, requests, or bundled JavaScript.


## Applied migration and grant verification

On 2026-11-02, both versioned migrations were applied to the connected Supabase project. The security-hardening migration returned `Success. No rows returned`.

- RLS remained enabled on all five required tables.
- The five tables retained 16 policies: profiles 2, sponsors 2, properties 6, property_sponsors 3, and inquiries 3.
- All seven explicit privilege checks returned true.
- Anonymous access can read properties and insert inquiries, but cannot insert properties or read inquiries.
- Authenticated access can select and insert properties, but cannot truncate the properties table.

## Live multi-role audit evidence

On 2026-11-02, `scripts/exam-live-security-smoke.mjs` completed against the connected development Supabase project.

- Approved property: `752db6a6-a14a-412d-b376-3af495225bc3`
- Owner A draft: `b9df51e0-9a38-4af0-a6c5-e343a6469d5c`
- Owner B draft: `0c17a479-db26-49a6-ac97-5ab664c6547a`
- Active sponsor: `12165ce6-b811-4156-bd63-948c570dc694`
- Inactive sponsor: `42e90b46-4315-4248-a280-200eff4c4ce4`
- Recorded inquiry: `c46428e5-c85e-4a8c-81fb-788a26aeeedc`
- Verification script commit: `512962c`
- The script printed no passwords, access tokens, or API keys.
