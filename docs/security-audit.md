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


## Lab 5 authorization matrix — live verification confirmed

Target: `public.properties`, with the existing ownership/status fields and the new numbered owner-deletion migration. The uploaded live evidence confirms all 23 checks passed and fixture restoration was verified. The matrix below is supported by those real requests/results. The earlier exam results above remain separate historical evidence.

| Role | Permitted operation | Denied operation | Enforced predicate/mechanism |
| --- | --- | --- | --- |
| Anonymous | SELECT an approved property. | INSERT a property. | SELECT requires `status = 'approved'`; INSERT lacks an anon grant/policy. Expect the actual permission response and code, not an invented HTTP status. |
| Resource owner | UPDATE their own draft price. | Change their own draft to approved or reassign its owner. | Existing and resulting row must satisfy `owner_id = auth.uid()`, permitted status `draft/rejected`, and profile role `property_owner`. |
| Other authenticated user | SELECT another owner's approved property. | UPDATE that owner's draft. | Public approved SELECT applies, but owner mutation USING filters out the other user's target. Expect an empty returned array and an unchanged protected record. |
| Authenticated administrator | UPDATE an approved property using verified admin identity. | UPDATE a property to negative price. | `is_exam_admin()` authorizes the operation; `CHECK (price >= 0)` rejects invalid data. The denied example is a constraint denial, not RLS. |

Trusted `service_role` is a separate server mechanism. It bypasses RLS but must still satisfy the price constraint. The live audit tests it separately; it does not replace Other Authenticated User in the required matrix.

### Repository SQL for the properties policies

The following exact source statements describe the submitted design. The new ALTER POLICY remains unapplied until explicitly authorized. Enable statements alone do not define permitted operations.

```sql
alter table public.properties enable row level security;

create policy "properties_public_select_approved"
on public.properties for select
to anon, authenticated
using (status = 'approved');

create policy "properties_owner_select_own" on public.properties for select to authenticated
using (
  owner_id = (select auth.uid())
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

create policy "properties_owner_insert_draft" on public.properties for insert to authenticated
with check (
  owner_id = (select auth.uid()) and status = 'draft'
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

create policy "properties_owner_update_unapproved" on public.properties for update to authenticated
using (
  owner_id = (select auth.uid()) and status in ('draft', 'rejected')
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
)
with check (
  owner_id = (select auth.uid()) and status in ('draft', 'rejected')
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

create policy "properties_owner_delete_own" on public.properties for delete to authenticated
using (
  owner_id = (select auth.uid())
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

create policy "properties_admin_all"
on public.properties for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- Follow-up change in the new versioned migration:
alter policy "properties_owner_delete_own"
on public.properties
using (
  owner_id = (select auth.uid())
  and status in ('draft', 'rejected')
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'property_owner'
  )
);
```

`is_exam_admin()` uses the caller's profile role in a SECURITY DEFINER helper; its fixed search path and execution grants are in the two original migrations. The policy listings above are repository definitions, not a query of the live project's current state.

### Diagnostic requests and responses

`scripts/lab5-rls-audit.mjs` is prepared to write `docs/lab5-live-evidence.json` only during a genuinely authorized live run. It records actor, exact method/path/query/body, redacted API-key/access-token placeholders, the Authorization header state, actual HTTP status, and raw response text with known credentials removed. No Auth sign-in responses are captured. Existing evidence is never overwritten automatically.

The anonymous draft SELECT and other-user draft SELECT examples must return the known hidden target's actual response. The anonymous property INSERT and other-user PATCH cases capture actual denial responses and verify unchanged fixture data. A 200 `[]` shows no rows visible/affected for the request, so an authorized read must establish that the target exists. A 403 is an explicit refusal; it is not inherently stronger protection than correctly filtered empty results. Network errors, wrong error codes, and missing targets must never count as passing RLS tests.

The runner saves its before/after snapshots for protected property-write cases, records individual check success/failure, and restores the preflight fictional records. Cleanup failure makes the whole audit fail. Do not mark the matrix verified or submit sample bodies as raw evidence until the real run is supplied. Application API and browser checks remain separate.


### Lab 5 applied policy definition — student verified

The student supplied a successful migration execution message and the actual `pg_policies` row: `properties_owner_delete_own` / `DELETE` / `{authenticated}`. Its predicate requires owner ID equal to `auth.uid()`, status `draft` or `rejected`, and the caller's `property_owner` profile. This verifies installation of the intended definition. Seed execution, live allowed/denied behavior, and cascade preservation remain unverified.


### Lab 5 actual diagnostic evidence

**Source:** [lab5-live-evidence.json](lab5-live-evidence.json), uploaded by the student and copied byte-for-byte into the working repository.  
**Run start:** November 02, 2026 at 11:52:40 PM PST  
**Result:** `completed: true`, all 23 checks passed.  
**Cleanup:** `original fictional records restored and verified`.

Requests below are copied from actual captured exchanges. Project URLs and credential values are placeholders. `Authorization: ABSENT` in the capture means the header was omitted; `ABSENT` was not transmitted as a literal header value. The requests targeted the Supabase database REST API, not the application's Next.js route.

#### Anonymous: forbidden draft read

Recorded redacted request:

```json
{
  "method": "GET",
  "url": "<SUPABASE_URL>/rest/v1/properties?select=id%2Cstatus&id=eq.50000000-0000-4000-8000-000000000001",
  "headers": {
    "apikey": "<PUBLIC_API_KEY>",
    "Authorization": "ABSENT",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  }
}
```

Actual HTTP status: **200**. Raw response body:

```json
[]
```

#### Anonymous: forbidden property INSERT

Recorded redacted request:

```json
{
  "method": "POST",
  "url": "<SUPABASE_URL>/rest/v1/properties?",
  "headers": {
    "apikey": "<PUBLIC_API_KEY>",
    "Authorization": "ABSENT",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
  },
  "body": {
    "id": "50000000-0000-4000-8000-000000000099",
    "owner_id": "6bb46830-76e8-4b60-acb9-e05a36328ec6",
    "address": "Lab 5 Fictional draftA Street",
    "price": 350000,
    "bedrooms": 3,
    "bathrooms": 2,
    "square_feet": 1400,
    "status": "draft"
  }
}
```

Actual HTTP status: **401**. Raw response body:

```json
{"code":"42501","details":null,"hint":"Grant the required privileges to the current role with: GRANT INSERT ON public.properties TO anon;","message":"permission denied for table properties"}
```

#### Other authenticated user: forbidden UPDATE

Recorded redacted request:

```json
{
  "method": "PATCH",
  "url": "<SUPABASE_URL>/rest/v1/properties?id=eq.50000000-0000-4000-8000-000000000001&select=id%2Cowner_id%2Caddress%2Cprice%2Cbedrooms%2Cbathrooms%2Csquare_feet%2Cstatus%2Ccreated_at",
  "headers": {
    "apikey": "<PUBLIC_API_KEY>",
    "Authorization": "Bearer <OWNERB_ACCESS_TOKEN>",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "price": 999
  }
}
```

Actual HTTP status: **200**. Raw response body:

```json
[]
```

The captured authorized before/after snapshots are equal, including property records, sponsor links, inquiries, and profiles.

#### Owner: forbidden self-approval

Recorded redacted request:

```json
{
  "method": "PATCH",
  "url": "<SUPABASE_URL>/rest/v1/properties?id=eq.50000000-0000-4000-8000-000000000001&select=id%2Cowner_id%2Caddress%2Cprice%2Cbedrooms%2Cbathrooms%2Csquare_feet%2Cstatus%2Ccreated_at",
  "headers": {
    "apikey": "<PUBLIC_API_KEY>",
    "Authorization": "Bearer <OWNERA_ACCESS_TOKEN>",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "status": "approved"
  }
}
```

Actual HTTP status: **403**. Raw response body:

```json
{"code":"42501","details":null,"hint":null,"message":"new row violates row-level security policy for table \"properties\""}
```

The captured authorized before/after snapshots are equal, including property records, sponsor links, inquiries, and profiles.

#### Administrator: invalid-price constraint denial

Recorded redacted request:

```json
{
  "method": "PATCH",
  "url": "<SUPABASE_URL>/rest/v1/properties?id=eq.50000000-0000-4000-8000-000000000003&select=id%2Cowner_id%2Caddress%2Cprice%2Cbedrooms%2Cbathrooms%2Csquare_feet%2Cstatus%2Ccreated_at",
  "headers": {
    "apikey": "<PUBLIC_API_KEY>",
    "Authorization": "Bearer <ADMIN_ACCESS_TOKEN>",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  "body": {
    "price": -1
  }
}
```

Actual HTTP status: **400**. Raw response body:

```json
{"code":"23514","details":null,"hint":null,"message":"new row for relation \"properties\" violates check constraint \"properties_price_check\""}
```

The captured authorized before/after snapshots are equal, including property records, sponsor links, inquiries, and profiles.

#### Security meaning of `[]` versus an explicit refusal

The anonymous draft read returned HTTP 200 with `[]`: the query executed but no target row was visible under its policies. The authenticated nonowner UPDATE also returned HTTP 200 with `[]`: its USING predicate matched no updatable row. The saved authorized snapshots establish that the Owner A draft existed and remained unchanged. Thus the empty results here are supported by existence/unchanged-data controls, rather than assumed to prove security on their own.

The anonymous INSERT returned HTTP 401 with PostgreSQL code `42501` and `permission denied for table properties`, demonstrating the missing anon INSERT grant. The message's suggested GRANT is a generic diagnostic hint, not a change to implement; the denial is intentional. Owner reassignment/self-approval returned 403 with `42501`. Administrator/service negative-price writes returned 400 with `23514`, demonstrating CHECK constraints rather than RLS restrictions.

Both filtered empty results and explicit permission errors can correctly enforce access rules. Unexpected network errors, wrong targets, and unrelated failures are not passing evidence. These REST results do not by themselves verify application routing, browser states, accessibility, secret history, or a clean-environment rebuild.

#### Coverage actually verified

- Approved-only public properties; active-only sponsors and public links.
- Other authenticated user reads approved properties and their own draft, but not Owner A's draft.
- Owner draft update and rejected-listing deletion permitted.
- Cross-owner update/deletion, ownership reassignment, and self-approval denied.
- Approved/pending owner update and deletion denied; protected before/after snapshots match.
- Profile role escalation denied; trusted snapshot comparison performed by the runner.
- Anonymous inquiry creation permitted; anonymous inquiry read denied; owners' inquiry reads isolated.
- Authenticated admin reads all five fixture tables and edits approved property. The admin all-table read check has no raw exchanges in the JSON; it is supported by the runner's recorded successful snapshot comparison.
- Admin and service invalid-price writes denied by the price constraint, with unchanged snapshots.
- All original fictional records restored and verified after the run.


## Lab 5 credential-pattern and available-history review

The student supplied laptop output from `feature/database` on November 3, 2026. `git check-ignore .env.local` returned `.env.local`. The following current-file and history filename scans printed no paths (the placeholder `.env.example` was explicitly allowed):

```powershell
git ls-files --cached --others --exclude-standard | Where-Object {
    $_ -match '(^|/)\.env($|\.)' -and
    $_ -notmatch '(^|/)\.env\.example$'
}

git log --all --format= --name-only | Where-Object {
    $_ -match '(^|/)\.env($|\.)' -and
    $_ -notmatch '(^|/)\.env\.example$'
} | Sort-Object -Unique
```

The student also ran these common-credential pattern checks. Both commands printed no output: no matching filenames from the current-file scan and no matching commit IDs from the history scan.

```powershell
$lab5SecretPattern = '-----BEGIN ([A-Z0-9]+ )*PRIVATE KEY-----|sb_secret_[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'

git grep --untracked -I -l -E -e $lab5SecretPattern -- .
git log --all --format=%h -G $lab5SecretPattern --
```

This is evidence for the specified private-key, Supabase secret-key, GitHub token, and JWT-shaped patterns in nonbinary current files and diffs reachable through locally available refs. Ignored files, unrecognized secret formats, ordinary passwords, unavailable remote/deleted refs, and binary content are not exhaustively covered. No credential values were printed or supplied. The checks do not prove that every possible secret is absent.

## Separate clean schema reconstruction

The student applied all three versioned migration files to an empty hosted project and supplied the five-table/RLS/policy query result. See [lab5-rebuild-evidence.md](lab5-rebuild-evidence.md). That verifies clean schema reconstruction separately from the original development project's 23 live role checks; neither result is relabeled as the other.
