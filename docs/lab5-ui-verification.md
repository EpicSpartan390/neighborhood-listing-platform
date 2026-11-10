# Lab 5 Step 12: Database listings in the existing UI

## What changed

The existing homepage requests `/api/properties` from the browser instead of importing the static property array. The existing server route still selects approved listings and six public columns using its public Supabase client. No credentials, service client, additional database columns, or new dependency were added to the browser code.

| API value | Card value |
| --- | --- |
| `id`, `address`, `price`, `bedrooms`, `bathrooms` | Same field names |
| `square_feet` | `squareFeet` |
| No image field | Existing `/property-placeholder.svg`, explicitly described as an illustration |
| No external listing URL | No external listing link; favorites and details still work |

There are separate loading, database-empty, filter-empty, and error states. Retry starts a fresh request. Canceled/stale requests cannot overwrite current results. A failed or malformed response is an error, not a fabricated empty database or a fallback to static listings. Raw errors are not shown. All neighborhoods is now explicit; Pacific Palisades matches its address text rather than bypassing the neighborhood filter.

Sponsor banners remain the existing clearly labeled fictional demos. Their database integration is outside this focused listing change.

## Verification performed in this workspace

- Read the supplied installed Next.js guides before editing, as required by `AGENTS.md`.
- Fifteen focused loader scenarios passed through Node 24 native TypeScript execution with mocked fetch: field mapping/request options, empty result, failed HTTP response, network failure, nine malformed payloads, invalid JSON, and abort propagation. These did not contact a database.
- Added equivalent Vitest cases in `tests/property-listings.test.ts` for the existing suite.
- Dependency installation failed with registry HTTP 403 for `zod-validation-error@4.0.2`. Full Vitest, lint, typecheck, production build, and browser checks have not passed here. Do not label this draft fully verified.
- Earlier live database evidence remains 23 passed checks with verified restoration. It does not verify this new UI.

## Laptop checks — passed on November 3, 2026

The student supplied the actual terminal output for:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run typecheck
```

ESLint completed without reported issues. Vitest 4.1.12 passed all 43 tests across 4 files: HTTP helpers 5, property listings 15, property schema 16, properties route 7. TypeScript completed without reported errors. The initial plain `npm` commands were blocked by PowerShell before the checks ran; using `npm.cmd` worked without changing execution policy.

## Production build and browser evidence

The student supplied successful `npm.cmd run build` output for Next.js 16.4.3: compilation, TypeScript, page data collection, and all 5 static pages completed. The homepage is prerendered; `/api/properties` remains dynamic. The student started the production server with `npm.cmd start`, which reported Ready on localhost:3000, then confirmed the website works.

The student supplied the actual public GET response below. No HTTP status/headers were supplied for this particular browser request; the JSON is evidence of its body only.

```json
{"data":[{"id":"50000000-0000-4000-8000-000000000003","address":"Lab 5 Fictional approvedA Street","price":350000,"bedrooms":3,"bathrooms":2,"square_feet":1400},{"id":"752db6a6-a14a-412d-b376-3af495225bc3","address":"303 Approved Audit Avenue 1793644740594","price":450000,"bedrooms":3,"bathrooms":2.5,"square_feet":1800}]}
```

An uploaded homepage screenshot showed both matching cards, correct prices/room counts/square footage, placeholders, and “2 properties shown.” The screenshot was inspected in the conversation; it is not included as a repository image in this update. After a specific four-check request, the student confirmed both matching cards, save toggling, details opening/closing, and Malibu no-match followed by All neighborhoods restoration. After the request-blocking instructions, the student separately confirmed the error message and successful retry. Interaction and error/retry outcomes are student confirmations, not independently automated browser runs.

| Verified browser behavior | Evidence |
| --- | --- |
| Two API records rendered with matching values | Supplied JSON and screenshot |
| Save toggles and details open/close | Student confirmation |
| Malibu produces no-match; All neighborhoods restores cards | Student confirmation |
| Blocked request produces generic error and Try again | Student confirmation |
| Unblocking and retry restores cards | Student confirmation |

Loading during a deliberately slowed request, the database-empty UI, malformed-response UI, narrow layouts, keyboard-only interaction, and stale-request races have not been separately verified in a browser in this Lab 5 session. Empty/malformed/abort behavior is covered at the loader level by the 15 tests, not a browser rendering test. The following matrix remains a reference procedure; rows without evidence above are not claimed as completed.

| Case | How to check locally | Expected behavior |
| --- | --- | --- |
| Public route | Open `/api/properties` with the configured development project | Approved listing rows, six public fields; no owner/account data |
| Success | Open homepage and inspect Network | GET `/api/properties`; returned addresses and values appear in cards |
| Loading | Throttle the API request in browser developer tools and reload | Loading properties message before cards |
| Database empty | Temporarily override the GET response locally to `{"data":[]}` | No approved properties message |
| Filter empty | Select All neighborhoods and a minimum exceeding a known returned listing's bedrooms | Separate no-match message when no returned rows match |
| Neighborhood | Select a city present in a returned address, then another city | Only matching addresses, or no-match state |
| HTTP/network failure | Block the API request locally, or override its status to 500 | Generic alert and Try again; no static property fallback |
| Retry | Remove the local block/override and activate Try again | Loading state, new GET, then cards |
| Invalid response | Override response to `{"data":null}` | Error state, not database-empty state |
| Card interactions | Use keyboard to save a property and open/close details | Existing pressed/expanded state changes; no invented listing link |
| Responsive layout | Check narrow and wide browser viewports | Existing responsive layout and visible keyboard focus |

Use browser-local overrides only; do not delete or edit database records to force UI states. Remove overrides and throttling afterward. Record which checks actually ran and retain failures for diagnosis.

No reset, commit, push, or deployment is part of this step.
