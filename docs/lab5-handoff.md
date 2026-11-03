# Lab 5 handoff and requirement checklist

## Starting point

- Source: the student's uploaded Git archive, `neighborhood-listing-platform-lab5(1).zip`.
- Archive comment confirms commit `e0cb2e3e2270e07dc8644cdc85bf86e9a638681b`.
- Original laptop branch: `exam/practical-persistence-eval`, clean and synced with origin when archived.
- Workspace: `/workspace/scratch/9466eb041e6a/neighborhood-listing-platform`.
- This extracted copy has no Git metadata, installed dependencies, or actual environment file. The archive has not been modified.
- Current student-confirmed laptop branch: `feature/database`, created from the existing exam commit. The student's latest laptop status shows the expected Lab 5 source/documentation changes and untracked scripts/tests, including the numbered SQL migration. This extracted workspace still has no Git metadata; no commit has been made here.
- Lab 3/4 artifacts not present in this branch must not be assumed lost or recreated. Other branches and their history were not supplied.

## Working agreement

Reuse existing code, follow the lab sequence, and show the student one current step at a time. Make focused local drafts; the student runs laptop commands. Preserve exam and earlier lab evidence. Stop at required Gemini/AI Studio checkpoints for actual responses. No commit, push, merge, deployment, or remote database change without explicit authorization. Never request or print credentials. Record actual results separately from historical claims or expected outcomes.

## Confirmed reusable implementation

| Requirement | Existing evidence | Current assessment |
| --- | --- | --- |
| Placeholder configuration | `.env.example`, `.gitignore` | Template has three placeholder values; ignore rules allow the template and exclude actual environment files. Student confirmed `Test-Path .env.local` is `True` and `git check-ignore .env.local` returns `.env.local`; values were not shared. |
| Five relational tables | `supabase/migrations/20261029140000_exam_schema_persistence.sql` | `profiles`, `properties`, `sponsors`, `property_sponsors`, and `inquiries` exist in versioned SQL with UUID keys, relationships, checks, and indexes. |
| RLS and limited grants | Both existing SQL migrations | RLS is enabled on all five tables. The second migration tightens privileges and owner role checks. Preserve these already-applied migrations; use a new migration for accepted changes. |
| Server-only database clients | `src/lib/supabaseServer.ts`, `src/lib/supabaseAdmin.ts` | Public, authenticated-user, and isolated privileged clients are already separated. Ordinary property requests do not import the service client. |
| GET and POST | `src/app/api/properties/route.ts` | Approved-only reads select six explicit columns. Creation validates input, verifies the user/profile, and assigns ownership and draft status on the server. The lab requires GET plus POST **or** PATCH; PATCH is not automatically needed. |
| Runtime validation | `src/schemas/property.ts`, `src/validator/createExamValidator.ts` | AJV is already installed and used. Reuse it; do not introduce Zod just because it appeared in earlier discussion. |
| Automated tests | `src/schemas/property.test.ts`, `tests/exam-http.test.ts`, `tests/exam-properties-route.test.ts` | Existing validation, request, and mocked route tests are reusable. Not rerun in this workspace. |
| Live test scripts | `scripts/exam-api-smoke.mjs`, `scripts/exam-live-security-smoke.mjs` | Reuse rather than duplicate. The live audit creates fictional fixtures and changes remote data; do not execute it without authorization. |
| Historical live evidence | `docs/security-audit.md`, exam entries in `docs/ai-log.md` | These report successful exam verification on November 2, 2026. Preserve as historical evidence; this review did not rerun those checks. |
| Accessible UI | Existing `PropertyCard`, `SearchFilters`, `SponsorBanner` | Preserve the exam's details disclosure, favorites, keyboard behavior, styling, and responsive layout. |

## Initial source-review gaps and review items (historical)

These describe the starting snapshot; completed corrections and current results are recorded below.

1. **UI integration:** `src/app/page.tsx` still imports the static `src/data/properties.ts` array. It does not fetch `/api/properties`, show a database loading state, or show a database failure state. Preserve the existing filtered-empty state when adding the required database states. Map API `square_feet` to existing `Property.squareFeet` and use existing placeholder artwork without inventing listing URLs or photographs.
2. **Relationship drawing completed in draft:** [database-design.md](database-design.md) now documents the existing five tables, cardinalities, field constraints, cascades, and decisions for AI review. The original migration files remain authoritative.
3. **Seed/rebuild draft prepared:** `scripts/lab5-seed.mjs` and shared fixtures now provide offline preview and explicitly gated development seeding. The verification guide describes clean rebuild prerequisites. Actual seed/rebuild remains pending.
4. **Owner deletion:** the current `properties_owner_delete_own` policy checks owner identity and profile role but not approval status. It permits an owner to delete an approved listing. Review this against Lab 5's unapproved-only owner mutation requirement, including inquiry/link cascades. Do not rewrite an already-applied migration.
5. **Denial assertions:** `deniedOrEmpty` in the live RLS script accepts any database error. A connection, schema, or other unrelated error must not count as a security pass. Strengthen it and verify that protected records remain unchanged, after the AI review checkpoint.
6. **Negative coverage:** the current live script does not explicitly attempt owner reassignment, self-approval, profile role escalation, or an anonymous property write. Add relevant tests using real request identities, with exact expected denial mechanisms.
7. **Diagnostic evidence:** the authorization matrix records results but lacks complete redacted requests and raw response bodies/statuses for the separate anonymous/other-user assignment. Add actual captures when run; do not fabricate them or relabel all denials as HTTP 403.
8. **Administrator distinction:** authenticated admin profiles use `is_exam_admin()` policies; a service role bypasses RLS. Explain this accurately. A service-role denied example must use an applicable constraint or server boundary, not an invented ownership-policy restriction. The normal POST route already verifies profile roles server-side; an admin UI or new admin endpoint is not automatically required.
9. **Inquiry policy review:** public inquiry insertion currently uses `WITH CHECK (true)` and relies on its FK/checks. Review whether inquiry targets should be restricted to public approved properties; distinguish the exam requirement from any new Lab 5 policy decision.
10. **Provenance and release:** obtain actual Lab 5 Gemini/AI Studio reviews, record accepted/rejected output, complete fresh checks, scan Git history on the laptop, and document partner contributions and submission links. Do not reuse the exam preview as proof that future Lab 5 changes are deployed.

## Verification performed in this review

- Checked all archive paths and rejected the possibility of path traversal/symlink extraction before extracting.
- Confirmed the ZIP's embedded commit matches the student's reported HEAD.
- Found only `.env.example` among archived environment files. Inspected value classifications without printing actual configuration values.
- Tested the supplied `.gitignore` in an isolated temporary Git repository: `.env.local`, `.env.production`, `node_modules/example.js`, and `.next/server/example.js` are ignored; `.env.example` is allowed.
- Preliminary pattern scan of 47 text files found no matches for private-key blocks, JWT-shaped values, Supabase secret-key values, or GitHub token values. This limited scan is **not** proof that there are no secrets; binaries/images and Git history were not scanned.
- Read both migrations, client configuration, property API, AJV validator/schema, homepage/components, exam test scripts, test definitions, requirements, and prior provenance/security notes.
- Student supplied real laptop output confirming `feature/database`, a clean working tree, an existing `.env.local`, and its ignored status.
- Compared the new database design document with the existing SQL and prepared the exact AI review input with both migration files in order. This is source review, not live database verification.
- Since the initial source review, focused offline Node suites and syntax checks have run; the latest suite passed 13 tests. No dependency install, full project lint/Vitest/typecheck/build, live request, migration apply/reset, commit, push, or deployment has run here.

## Checklist to maintain

- [x] Step 1: Student created `feature/database` and confirmed existing `.env.local` presence and ignore status without exposing/overwriting it.
- [x] Step 2: Drafted the existing five-table relationship diagram and reviewed keys, checks, timestamps, nullability, and cascades against the SQL.
- [x] Step 3: Received the student-supplied external review and documented accepted/adapted/rejected suggestions. Student identified Gemini Flash-Lite; exact version not supplied.
- [x] Steps 4-8: Student authorized and applied the follow-up migration and fictional seed; uploaded audit evidence confirms 23 passed role checks and verified fixture restoration. The separate hosted clean schema rebuild is now verified; see `lab5-rebuild-evidence.md`.
- [x] Steps 9-11: Reused server-only configuration and GET/POST routes. Source review, 7 mocked route tests, and the actual browser GET are verified. No fresh authenticated application POST was run in this session.
- [x] Step 12: Connected listing UI to GET; implemented loading/empty/error/retry states. Screenshot confirms API values on cards; student confirms filters, favorites, details, error, and retry. Remaining browser coverage limits are recorded in the UI guide.
- [x] Step 13: Laptop lint/typecheck/build passed; all 43 Vitest tests passed. Uploaded 23-check live role evidence includes genuine denials, redacted exchanges, unchanged-state checks, and verified restoration. No claim of unperformed browser cases or a fresh app POST.
- [x] Step 14 security checks: Student confirmed ignored local environment configuration and no private env paths or specified credential-pattern matches in current files/available history. Scope limits are recorded in the security audit.
- [ ] Submission: Review the reflection/individual-contribution draft, inspect staged changes, obtain actual partner review evidence, and add real PR/deployment/demo links as applicable. Commit and push require separate explicit approval.

## Current draft changes

- Added this handoff/checklist.
- Added `docs/database-design.md` with the source-based ER drawing and schema review.
- Added `docs/lab5-ai-review-prompt.txt` containing the prepared review prompt, exact current SQL, input schema, and problematic denial-test helper. The student has returned the external response; the model was identified as Gemini Flash-Lite (exact version not supplied).
- Appended Lab 5 kickoff/audit and Step 1/2 entries to `docs/ai-log.md` without changing earlier evidence. The exact kickoff prompt is preserved there; the exact prepared external review prompt is preserved in its own referenced file.
- Added `supabase/migrations/20261103000000_lab5_owner_delete_unapproved.sql`, subsequently applied by the student and verified by policy query and live role audit. Prior migrations are unchanged. Later UI changes are described below.

## Current UI draft and verification limits

Received the installed Next.js guide archive (the second archive is identical). Read the supplied server/client component, fetching, client fetching, error-handling, route-handler, and use-client guides before application edits. Retained the existing client page and used a cancellable browser fetch to the existing API without adding packages. This is a focused one-request integration; it does not need a shared browser cache or a new fetching library.

The page no longer imports the static property array. A small public-response loader maps `square_feet` to `squareFeet`, validates render-critical fields, and supplies existing placeholder artwork. The shared `listingUrl` is optional and the card renders its external link only when supplied. Existing static source data and historical evidence remain intact. Loading, database-empty, filtered-empty, generic error, and retry states are distinct. Unmount/retry cancellation guards prevent stale responses from updating state. Added an explicit All neighborhoods choice and corrected Pacific Palisades so it filters by address instead of matching every property. Sponsor demos, favorites, details disclosure, and existing styles remain.

Actual verification: dependency installation via `npm ci --ignore-scripts --no-audit --no-fund` failed with HTTP 403 on the registry tarball for `zod-validation-error@4.0.2`. No dependencies or lockfile were intentionally changed. Fifteen focused loader scenarios passed using Node 24 native TypeScript execution with mocked fetch and strict assertions. Equivalent Vitest coverage is in `tests/property-listings.test.ts`; Vitest itself, ESLint, typecheck, build, and a real browser were not run here. This is not a successful full project validation. No database request, reset, commit, push, or deployment occurred.

## Exact next action

Both uploaded JSONs are identical. Inspected the original: completed=true, all 23 checks pass, cleanup verified. Saved it byte-for-byte as docs/lab5-live-evidence.json and finalized the actual four-role matrix/request examples in docs/security-audit.md. Do not rerun the audit or ask for the JSON again.

The student supplied correct feature/database status, successful private-env filename and credential-pattern/history scans, and a completed clean hosted schema rebuild. Provide the final documentation review ZIP, including `lab5-reflection.md` and `lab5-rebuild-evidence.md`. Ask the student to review the reflection/contribution statements, stage the known Lab 5 changes, and return the staged diff summary. Staging is reversible; do not provide a commit command or push command before the required separate approvals. Partner review and actual PR/deployment/demo links are still pending. Do not repeat successful tests or uploads. No reset, commit, push, or deployment is authorized.

## Filename decision resolved

The student chose to resume from the laptop status showing the original numbered migration. Restored the workspace draft to `20261103000000_lab5_owner_delete_unapproved.sql` for compatibility with the lab and Supabase CLI. The unnumbered download is superseded; do not install it. No SQL contents changed.


## Student laptop verification after the UI draft

On November 3, 2026, the student supplied successful ESLint, Vitest (43 tests/4 files), TypeScript, and Next.js 16.4.3 production-build output. The production server reported Ready on localhost:3000. A supplied public API response and homepage screenshot match two database listings. The student confirmed save toggles, details disclosure, Malibu no-match/All neighborhoods restoration, then separately confirmed the request-blocked error and successful retry. See `lab5-ui-verification.md` for exact evidence and limits; do not mark every browser case complete.


## Final technical evidence before submission review

The student confirmed feature/database and the expected uncommitted Lab 5 paths. `.env.local` was ignored. The current/private-env filename scan and available-history filename scan printed no private env paths. The common-credential grep and history pickaxe scans printed no filenames/commit IDs. Their limited pattern/history scope is recorded in the security audit.

Docker was unavailable, so the student created the separate empty hosted project neighborhood-lab5-rebuild. All three saved migrations ran successfully in order. The supplied read-only catalog query returned five RLS-enabled tables and 16 policies (3/2/6/3/2), with the correct final owner-delete rule. The second migration showed a dismissed warning whose exact wording is unknown; do not invent its cause. Clean schema reconstruction is complete. No Auth provisioning/seed/role rerun was claimed for that project, and no CLI migration-history entry was established.

Draft reflection and attribution identify Pedro Chavez-Luna's executions/verification and AI-assisted implementation. Anderson Mejia Sanchez is the assigned partner; their actual Lab 5 contribution/review remains unreported. The student must review the draft before submission. Earlier approval constraints require approving file changes before a commit and a separate approval before push.
