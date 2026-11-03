# ADR 001: Property Data Contract and Runtime Validation

- **Status:** Accepted
- **Date:** October 8, 2026
- **Decision owner:** Pedro Chavez-Luna
- **Project:** Neighborhood Listing Platform

## Context

The Neighborhood Listing Platform receives structured property information that may originate outside the user interface, including AI-generated JSON. TypeScript protects code during development, but its types are erased when the application runs. An external JSON value can therefore compile after an unsafe assertion while still containing missing fields, incorrect primitive types, invalid values, or unexpected properties.

The application requires a boundary that verifies untrusted data before it reaches the existing `PropertyCard` and `SponsorBanner` components.

The course lab also requires:

- An explicit JSON data contract.
- Five fictional property records.
- Runtime validation.
- Valid and deliberately invalid test fixtures.
- TypeScript types derived from the schema.
- A documented decision about amenity normalization.
- No real client or personal information.

## Data Model and Relationships

| Concept | Primary key | Relationship |
|---|---|---|
| Property | `property_id` | A property contains one or two local sponsor associations. |
| Sponsor | `sponsor_id` | The same sponsor may appear on more than one property. |
| PropertySponsor | `property_id` plus `sponsor_id` | Conceptual many-to-many relationship serialized through each property’s `local_sponsors` array. |

The current JSON document embeds sponsor details inside `local_sponsors` because the project uses a small static dataset. The UI deduplicates sponsors by `sponsor_id` before rendering sponsor banners.

If the application later adopts a relational database, Property, Sponsor, and PropertySponsor should become separate tables. That database design is deferred because no backend or relational database is required by the current lab.

## Decision

### 1. JSON Schema is the authoritative data contract

The project uses JSON Schema Draft 2020-12:

- `schemas/property.schema.json`
- `schemas/property-dataset.schema.json`

The schemas define:

- Required fields.
- Property and sponsor identifiers.
- Nested address fields.
- ZIP-code patterns.
- Nonnegative numerical values.
- Minimum string lengths.
- URL and UUID formats.
- Controlled enum values.
- One or two sponsors per property.
- Exactly five records in the generated dataset.
- Rejection of unexpected properties through `additionalProperties: false`.
- Synthetic-data metadata.

The dataset schema references the property schema instead of repeating the property rules.

### 2. Ajv performs runtime validation

Ajv 2020 validates the Draft 2020-12 schemas. `ajv-formats` enforces supported formats such as UUIDs and URLs.

External JSON begins as `unknown`. It is not asserted directly as trusted application data. The validation boundary returns a typed success result only after Ajv accepts the value.

Invalid data fails closed. The normalization module throws an error rather than silently passing malformed records into the user interface.

### 3. TypeScript types are generated from the schema

`json-schema-to-typescript` generates:

`src/types/property-dataset-contract.generated.ts`

The repeatable command is:

`npm run generate:types`

The generated file provides `SyntheticPropertyDataset` and `PropertyListingContract`. It must not be manually edited. Schema changes require regeneration followed by TypeScript, test, and build verification.

JSON Schema remains authoritative because some runtime constraints—including formats, patterns, numerical ranges, and uniqueness—cannot be represented completely by TypeScript types.

### 4. External and UI models remain separate

The validated external contract uses snake_case fields. The existing React components use smaller camelCase display models.

| External contract | UI model |
|---|---|
| `property_id` | `id` |
| Address object plus `zip_code` | Formatted `address` string |
| `square_feet` | `squareFeet` |
| `image_src` | `imageSrc` |
| `image_alt` | `imageAlt` |
| `listing_url` | `listingUrl` |
| Sponsor snake_case fields | Sponsor camelCase fields |

The boundary in `src/data/validatedListings.ts` validates first and normalizes second.

Amenities and sponsor tiers are validated but are not copied into the current UI models because the existing components do not display them.

### 5. Amenities use controlled enum values

Amenities use these controlled values:

- `AIR_CONDITIONING`
- `CENTRAL_HEATING`
- `GARAGE_PARKING`
- `SWIMMING_POOL`
- `EV_CHARGING`
- `SOLAR_PANELS`

Free text was rejected because the original AI-generated dataset produced 19 unsupported variations, including `Attached Garage`, `Central Air Conditioning`, and `EV Charging Station`.

A database join table was considered but deferred. It would become appropriate if amenities require reusable records, translations, icons, administrative editing, or relational queries.

### 6. AI Studio uses a separate helper schema

Google AI Studio rejected parts of the full schema and later exceeded its structured-output constraint-complexity limit. A simplified helper schema guides generation:

`schemas/ai-studio-output.schema.json`

This helper is not authoritative. All AI output must still pass the stricter local Ajv schemas.

## Alternatives Considered

### TypeScript types without runtime validation

Rejected because TypeScript types are erased at runtime. A type assertion can make invalid external data appear trusted without checking it.

### Zod as the single source of truth

Considered but not selected. The lab explicitly requires JSON Schema, and Ajv directly validates Draft 2020-12. Adding a second runtime schema system would duplicate responsibility.

### Free-text amenities

Rejected because free text permits spelling differences, synonyms, capitalization differences, and unsupported categories that make filtering unreliable.

### Immediate relational normalization

Deferred because the project has no database. Separate Sponsor and PropertySponsor tables would add complexity without supporting a current requirement.

### Trusting AI Studio structured output without local validation

Rejected because the first generated response was valid JSON but violated the amenity contract 19 times.

## Consequences

### Positive consequences

- Invalid external data is rejected before rendering.
- AI output is treated as an untrusted draft.
- Schema compilation and reference resolution are tested.
- Generated TypeScript types reduce schema/type drift.
- Controlled amenities support consistent filtering and display.
- External naming conventions do not leak into React components.
- Raw and corrected AI datasets remain available for audit evidence.
- The UI renders only fictional course-lab data.

### Tradeoffs and limitations

- Schema changes require rerunning `npm run generate:types`.
- Runtime validation remains necessary even when TypeScript passes.
- The current address normalization creates a display string; structured address parts are not retained in the UI model.
- Sponsor deduplication keeps the first value for a repeated `sponsor_id`; conflicting duplicate sponsor data is not reconciled.
- The client-side data path includes Ajv validation overhead.
- The AI Studio helper schema is intentionally weaker than the authoritative schemas.
- Adding a new amenity requires an intentional schema update and regenerated types.

## Verification

The implementation is verified with:

- `npm run generate:types`
- `node scripts/check-schemas.mjs`
- `npm run validate:data`
- `npm test`
- `npm run lint`
- `npm exec tsc -- --noEmit`
- `npm run build`

Current verified results:

- Both schemas compile as Draft 2020-12.
- The dataset schema resolves the property-schema reference.
- The corrected five-record dataset passes.
- The untouched AI output fails for invalid amenities.
- Five invalid-condition tests fail for their expected reasons.
- Two test files pass.
- Ten tests pass.
- ESLint passes.
- TypeScript passes.
- The Next.js production build succeeds.
- Browser verification shows five properties and two unique sponsors.

## Evidence

- Raw AI output: `data/generated/synthetic-properties.raw.json`
- Corrected data: `data/generated/synthetic-properties.json`
- Contract fixtures: `data/fixtures/`
- Contract tests: `tests/contract.test.ts`
- Normalization tests: `tests/normalization.test.ts`
- AI Studio output: `docs/ai-studio-structured-output.png`
- Gemini critique: `docs/screenshots/lab3-gemini-normalization-critique.png`
- Validated UI: `docs/screenshots/lab3-validated-ui.png`
- AI collaboration record: `docs/ai-log.md`
