# Lab 6 sponsor eligibility and selection policy

Status: Integrated into the Lab 6 working branch. Database changes have not yet been applied to Supabase.

## Eligibility rules

A sponsor is eligible only when all of these rules are true:

1. The sponsor record is administratively `APPROVED` and its existing `active_status` flag is true.
2. The requested placement matches the campaign placement.
3. The supplied date is on or after `start_date` and on or before `end_date`. A missing `end_date` means the campaign has no scheduled end.
4. The property's five-digit ZIP code appears in the sponsor's approved ZIP coverage data. The stored `distance_miles` must be no greater than the sponsor's approved radius. No user location, IP address, or sensitive trait is used.
5. The sponsor has not reached its global daily impression cap. A missing cap means no daily cap applies.
6. The destination is an approved HTTPS URL with a normal hostname. Unsafe schemes, credentials in URLs, localhost names, and raw IP-address hosts are rejected by the application validator and redirect route.

The database query returns only public campaign fields required by the selector and renderer. It does not expose internal notes or user data.

## Deterministic selection

After ineligible records are removed, candidates are ordered by:

1. tier: Platinum, Gold, Silver, then Bronze;
2. shortest approved ZIP distance;
3. fewest impressions for the current day;
4. higher campaign priority;
5. sponsor ID in ascending order as the final stable tie-breaker.

The first candidate is selected. Given the same candidates, date, and impression fixture, the result is always the same. If no candidate remains, the UI renders the non-commercial house message instead of an undisclosed or ineligible sponsor.

For the assignment's ZIP `90032` example, Sponsor C wins. Sponsor D is excluded before ranking because its status is Pending. Among the remaining records, Gold outranks Silver, and Sponsor C's 0.8-mile distance beats Sponsor B's 1.2-mile distance.

## Disclosure, telemetry, and fairness

Every paid placement displays `Sponsored Partner` next to the sponsor link. The accessible name of the link also identifies it as sponsored before activation.

An impression stores only the sponsor ID, placement, timestamp, and coarse page context. The class implementation does not store IP addresses, account IDs, device identifiers, or sensitive-trait data.

Selection never uses names, email addresses, account identity, inferred demographics, protected characteristics, browsing history, or discriminatory housing-targeting criteria.

