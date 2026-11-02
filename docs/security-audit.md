# Row-Level Security Audit

This document contains the required authorization matrix and the procedure for producing genuine test evidence. Do not change an expected result to `PASS (verified)` until the test has been executed against the submitted Supabase project.

## Authorization matrix

| Actor | Operation | Expected result | Verified result / evidence |
| :--- | :--- | :--- | :--- |
| Anonymous | Select an approved property | PASS | Pending live Supabase test |
| Anonymous | Select a draft property | FAIL / zero rows | PASS verified 2026-11-02: public GET returned zero rows after an authenticated owner draft was created. |
| Anonymous | Select an active sponsor | PASS | Pending live Supabase test |
| Anonymous | Select an inactive sponsor | FAIL / zero rows | Pending live Supabase test |
| Owner A | Insert a draft owned by Owner A | PASS | PASS verified 2026-11-02: authenticated API returned HTTP 201 and created draft b9df51e0-9a38-4af0-a6c5-e343a6469d5c with the authenticated owner ID. |
| Owner A | Update Owner A's draft listing | PASS | Pending live Supabase test |
| Owner A | Update Owner A's approved listing | FAIL / denied | Pending live Supabase test |
| Owner A | Update Owner B's listing | FAIL / denied | Pending live Supabase test |
| Anonymous/inquirer | Insert a valid inquiry | PASS | Pending live Supabase test |
| Anonymous/inquirer | Select existing inquiries | FAIL / zero rows | Pending live Supabase test |
| Property owner | Select inquiries for their property | PASS | Pending live Supabase test |
| Property owner | Select inquiries for another owner's property | FAIL / zero rows | Pending live Supabase test |
| Admin profile | Read/write across all five tables | PASS | Pending live Supabase test |
| Trusted service role | Read/write across all five tables | PASS | Pending server-only test |

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
