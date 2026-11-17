\# Lab 6 sponsor-query performance note



Date verified: 2026-11-17



\## Scope



The live `neighborhood-listing-lab6` Supabase project was inspected with `EXPLAIN` only. `ANALYZE` was disabled, so the query was planned but not executed and no telemetry or application data was changed.



\## Existing indexes



The eligibility query is supported by:



\- `properties\_pkey` for property ID lookup.

\- `properties\_postal\_code\_idx` for ZIP-based property access patterns.

\- `sponsors\_eligibility\_idx` for status, active flag, placement, and campaign dates.

\- `sponsor\_zip\_coverage\_lookup\_idx` for ZIP, distance, and sponsor lookup.

\- `sponsor\_zip\_coverage\_pkey` for sponsor and ZIP joins.

\- `sponsor\_impressions\_daily\_idx` for sponsor and timestamp-range counting.



\## Observed plan



PostgreSQL estimated a total cost of `9.58` and one result row.



The plan used:



1\. `sponsors\_eligibility\_idx` to filter approved, active sponsors for `PROPERTY\_DETAIL` whose campaign had started.

2\. `properties\_pkey` to find the requested property.

3\. `sponsor\_zip\_coverage\_pkey` to join the sponsor to the property's ZIP and apply the radius condition.

4\. `sponsor\_impressions\_daily\_idx` to count that sponsor's impressions inside the UTC daily range.

5\. A final sponsor-ID sort for stable output.



No sequential scan appeared in the observed plan.



\## Decision



No additional index was added. The current indexes match the query's filters, joins, and daily-count range. Adding another index without evidence would increase insert and maintenance cost without a demonstrated benefit.



The impression placement remains a post-index filter after sponsor ID and timestamp range. A wider impression index should be considered only if representative production data later shows that this filter is expensive.



\## Limitation



This is a small development database. The plan should be inspected again with representative row counts before making production-scale indexing decisions.

