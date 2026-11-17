\# Lab 6 predictable sponsor demonstration



Date verified: 2026-11-17



Implementation commit: `bf7f088` - add deterministic sponsor demo seed



\## Fictional data



The separate `neighborhood-listing-lab6` Supabase project contains:



\- One fictional property-owner account: `lab6.owner@example.com`

\- Three fictional approved properties in ZIP codes `90031`, `90032`, and `90033`

\- Six fictional sponsors distributed across those ZIP codes

\- Fictional daily impression fixtures

\- No real personal data, passwords, IP addresses, or individualized targeting data



\## Predictable outcomes



| Property ZIP | Outcome | Explanation |

| --- | --- | --- |

| `90031` | Sponsor E - Fictional Gold Community Cafe | The approved, active Gold sponsor is within the approved ZIP radius and has 10 daily impressions. |

| `90032` | Sponsor C - Fictional Gold Market | Pending Platinum Sponsor D is excluded. Gold outranks Silver, and Sponsor C's 0.80-mile distance beats Sponsor B's 1.20-mile distance. |

| `90033` | House fallback | Sponsor F is expired, so no eligible candidate remains. The UI displays `No local sponsor available`. |



\## Live verification result



The read-only demonstration query returned:



\- `90031` - `SPONSOR\_SELECTED` - Sponsor E - distance `0.30` - impressions `10`

\- `90032` - `SPONSOR\_SELECTED` - Sponsor C - distance `0.80` - impressions `90`

\- `90033` - `HOUSE\_FALLBACK` - no sponsor fields



\## Local verification



\- Demo-seed database test: passed

\- Lab 6 migration/database tests: 17 of 17 passed

\- Complete project suite: 101 of 101 tests across 11 files passed

\- TypeScript: passed

\- ESLint: passed



\## Seed behavior



The committed seed is repeatable. On each run it updates the fixed fictional records and resets only the current UTC day's impressions belonging to the six fixed demo sponsor IDs before recreating the documented fictional counts.