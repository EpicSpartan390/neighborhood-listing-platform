# Sponsor-Backed Property Listing & Inquiry Requirements

## Story 1 — Property owner (Medium)

As a registered property owner, I want to submit listing drafts so that prospective buyers can review them once administrative staff verifies them.

**Acceptance criteria**

- **Given** an authenticated user whose profile role is `property_owner`, **when** the user submits a valid property payload to `POST /api/properties`, **then** a property is stored with `status = 'draft'` and `owner_id = auth.uid()`.
- **Given** an invalid or unexpected property field, **when** the owner submits the payload, **then** the API returns HTTP 400 with structured validation details and no database row is created.
- **Given** Owner A, **when** Owner A tries to update Owner B's property, **then** PostgreSQL RLS denies the operation.

**Traceability:** [database migration](../supabase/migrations/20261029140000_exam_schema_persistence.sql), [property contract](../src/schemas/property.ts), and [properties route](../src/app/api/properties/route.ts).

## Story 2 — Public inquirer (Medium)

As a prospective neighborhood resident, I want to view approved properties with their active tier-level sponsors and submit an inquiry without seeing inquiries from other users.

**Acceptance criteria**

- **Given** an anonymous visitor, **when** listings and sponsors are queried, **then** only `approved` properties, `active_status = true` sponsors, and approved-property sponsor links are visible.
- **Given** an anonymous visitor and a valid inquiry, **when** the inquiry is inserted, **then** the database accepts it.
- **Given** an anonymous visitor or ordinary authenticated inquirer, **when** existing inquiries are selected, **then** no inquiry rows are visible.

**Traceability:** [database migration and RLS](../supabase/migrations/20261029140000_exam_schema_persistence.sql), [GET properties route](../src/app/api/properties/route.ts), and [property UI](../src/components/PropertyCard.tsx).

## Story 3 — Platform administrator (Large)

As a platform administrator, I want full override authority across all examination tables so that I can conduct compliance audits.

**Acceptance criteria**

- **Given** an authenticated user whose profile role is `admin`, **when** the administrator selects, inserts, updates, or deletes records in an examination table, **then** the matching administrator RLS policy authorizes the operation.
- **Given** a trusted server process using the server-only service-role credential, **when** it performs an authorized compliance operation, **then** it can bypass RLS without exposing the credential to a browser bundle.
- **Given** a non-admin user, **when** that user attempts an administrator-only operation, **then** PostgreSQL denies it.

**Traceability:** [administrator policies and helper function](../supabase/migrations/20261029140000_exam_schema_persistence.sql) and [server-only Supabase clients](../src/lib/supabaseServer.ts).


