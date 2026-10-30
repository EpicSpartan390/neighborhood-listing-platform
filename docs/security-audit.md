# Row-Level Security Audit

This document contains the required authorization matrix and the procedure for producing genuine test evidence. Do not change an expected result to `PASS (verified)` until the test has been executed against the submitted Supabase project.

## Authorization matrix

| Actor | Operation | Expected result | Verified result / evidence |
| :--- | :--- | :--- | :--- |
| Anonymous | Select an approved property | PASS | Pending live Supabase test |
| Anonymous | Select a draft property | FAIL / zero rows | Pending live Supabase test |
| Anonymous | Select an active sponsor | PASS | Pending live Supabase test |
| Anonymous | Select an inactive sponsor | FAIL / zero rows | Pending live Supabase test |
| Owner A | Insert a draft owned by Owner A | PASS | Pending live Supabase test |
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

