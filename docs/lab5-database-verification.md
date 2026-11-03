# Lab 5: Seed and verification procedure

## Current stage: database, application, and clean schema rebuild verified

The student applied the numbered owner-delete migration, verified its policy definition, and ran the guarded seed in the authorized development project. The uploaded live audit evidence confirms 23 passed database REST checks, unchanged protected records, and verified fixture restoration. See `docs/lab5-live-evidence.json` and `docs/security-audit.md`. Do not repeat those completed steps. Keep the numbered `20261103000000_lab5_owner_delete_unapproved.sql` name; the unnumbered download is superseded.

The listing UI draft now fetches the existing public GET route. Laptop lint/typecheck/build and all 43 Vitest tests passed; the student also verified matching cards, filtering, favorites/details, and error/retry behavior; see `docs/lab5-ui-verification.md`. The separate clean schema rebuild is verified in [lab5-rebuild-evidence.md](lab5-rebuild-evidence.md). No reset, commit, push, or deployment is authorized.

## Earlier offline seed verification (completed)

From the repository root, run:

```powershell
node scripts/lab5-seed.mjs --dry-run
node --test tests/lab5-seed.node-test.mjs
```

These commands do not load `.env.local`, import the Supabase SDK, or contact a database. Preview UUIDs are illustrative only. The six Node tests run separately from the existing Vitest suite; their filename deliberately avoids Vitest's default test-file pattern.

Expected preview counts:

| Table | Rows | Purpose |
| --- | --- | --- |
| `profiles` | 3 | Existing Auth identities for Owner A, Owner B, and administrator. |
| `properties` | 5 | Owner A draft/approved/pending/rejected and Owner B draft. |
| `sponsors` | 2 | Active and inactive fictional sponsors. |
| `property_sponsors` | 3 | Approved/active, approved/inactive, and draft/active connections. |
| `inquiries` | 2 | One for Owner A's approved property, one for Owner B's draft. |

## How the real seed is designed

`scripts/lib/lab5-fixtures.mjs` defines the fictional fixtures for reuse by subsequent authorization tests. `scripts/lab5-seed.mjs` signs in to the three existing development Auth accounts and uses their returned UUIDs. It does not invent account IDs or create Auth users. Existing profile roles must match; absent profiles can be inserted by the trusted development setup.

Application requires the existing Supabase URL/public key/service key and the same private `EXAM_TEST_*`, `EXAM_OWNER_B_*`, and `EXAM_ADMIN_*` account variables already used by the exam audit. Keep actual values only in ignored local configuration. The script requires `--apply` plus `LAB5_CONFIRM_DEVELOPMENT` matching the chosen development URL's host. This is an explicit target acknowledgement, not automatic proof that a project is disposable. The student already completed the authorized apply run on the original development project; no repeat run is assigned.

All identity checks and collision reads run before the first seed write. The script refuses mismatched profile roles, different owners/addresses at reserved property IDs, and unrelated sponsor/inquiry content at reserved IDs. Repeating a seed restores mutable fields of these known fictional fixtures; it does not delete unrelated records. Do not run it concurrently with edits/tests.

Writes occur in foreign-key order: profiles, sponsors, properties, connections, inquiries. These SDK requests are not a single transaction. A late failure can leave earlier fictional writes in place; inspect the reported stage before retrying. A passed seed is administrative setup, not evidence that public/owner RLS works. The script prints stage/count information without raw SDK errors, credentials, or account details.

## Clean-environment schema rebuild — completed

On November 3, 2026, the student applied the three saved migrations in order to the separate empty hosted project `neighborhood-lab5-rebuild`. Each returned Success. No rows returned. A catalog query then showed all five expected tables with RLS enabled, policy counts of 3/2/6/3/2 (inquiries/profiles/properties/property_sponsors/sponsors), and the final owner-delete predicate requiring ownership, draft/rejected status, and the property-owner role.

See [lab5-rebuild-evidence.md](lab5-rebuild-evidence.md) for the exact query, supplied results, and limits. This verifies clean schema reconstruction through the SQL Editor, not CLI migration-history tracking or a local reset. The original application configuration was retained. The seed and 23-check role audit ran on the original development project; they were not repeated on this clean project.

For a future local CLI workflow, the repository would need local configuration and a running initialized disposable stack. The JavaScript seed is a separate step and is not automatically executed as `supabase/seed.sql`. Those are procedure notes, not additional completed results.

## Required role verification — completed in the uploaded live evidence

- Public controls: approved listing and active sponsor visible; known draft, inactive sponsor, and nonpublic links hidden.
- Owner controls: own draft updates/deletes permitted; self-approval, reassignment, other-owner writes, approved/pending updates/deletes denied.
- Profile controls: ordinary user cannot change their role to admin.
- Inquiry controls: anonymous submission permitted; anonymous inquiry SELECT denied; each owner sees only the permitted inquiries.
- Administrator controls: trusted authenticated admin access tested separately from service access. Invalid negative-price writes must fail a database constraint even for privileged roles.
- For an expected zero-row denial, require no error and an empty returned array; then confirm protected data and related rows stayed unchanged through authorized access.
- For a privilege or WITH CHECK denial, require the precise expected code (such as `42501`); reject network/schema/unrelated failures. Capture the exact redacted request, actual HTTP status, and response body for anonymous and other-user examples.

The uploaded Lab 5 evidence records the implemented role checks and real outcomes. The older exam script/evidence remains intact for comparison. These database REST results do not establish application-route or browser behavior.


## Earlier progress: seed checks and audit preparation (historical)

The student supplied real laptop output showing the seed preview counts above and all 6 original seed safety tests passing. That did not apply migrations or write database records.

Shared development-account setup was subsequently extracted to `scripts/lib/lab5-clients.mjs` for reuse by seed and audit. The updated combined offline suite has 13 tests and passed in this workspace:

```powershell
node --test tests/lab5-seed.node-test.mjs tests/lab5-audit.node-test.mjs
```

This runs no database requests. Syntax checks of the new live audit and client module also passed here. Those checks were pending at this earlier stage; later laptop checks and uploaded live evidence are recorded above and in the linked guides.

The live audit entry point is `scripts/lab5-rls-audit.mjs`. Its run mode requires explicit `--run` and target confirmation. It refuses to overwrite an existing `docs/lab5-live-evidence.json`; preserve and inspect any previous run first. Do not run live mode until the development project, migration, fixtures, and authorization are confirmed.

The runner preflights the exact fictional data and refuses unexpected attached records. It checks public/owner/other-user/admin/service behavior, captures redacted request/response evidence, verifies denied writes against trusted snapshots, and restores its fictional data. It temporarily performs allowed updates, a rejected-fixture deletion, and an anonymous fictional inquiry insertion. Its restoration is best effort through individual SDK writes, not a database transaction; a failed cleanup is an overall failure needing inspection. Do not run it alongside edits or other tests.
