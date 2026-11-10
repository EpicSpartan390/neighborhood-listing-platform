# Lab 5: Clean schema rebuild evidence

## Target and execution

On November 3, 2026, the student created the separate empty Supabase project `neighborhood-lab5-rebuild` and applied the existing saved migrations in the SQL Editor, in this order:

| Order | Saved migration | Student-reported execution result |
| --- | --- | --- |
| 1 | `20261029140000_exam_schema_persistence.sql` | Success. No rows returned |
| 2 | `20261029150000_exam_security_hardening.sql` | Success. No rows returned |
| 3 | `20261103000000_lab5_owner_delete_unapproved.sql` | Success. No rows returned |

Docker was not available in the student's PowerShell session, so this used a clean hosted project. The original development project and local application configuration were left in place. The second migration produced a pre-execution warning, whose exact text was not retained. Its saved SQL replaces four policies and changes grants; the execution result was successful. No claim is made about the dismissed warning's exact cause.

## Read-only verification

The student then ran this query in the rebuild project's SQL Editor:

```sql
select
  t.tablename,
  t.rowsecurity as rls_enabled,
  (
    select count(*)
    from pg_policies p
    where p.schemaname = t.schemaname
      and p.tablename = t.tablename
  ) as policy_count,
  (
    select p.qual
    from pg_policies p
    where p.schemaname = t.schemaname
      and p.tablename = t.tablename
      and p.policyname = 'properties_owner_delete_own'
  ) as owner_delete_rule
from pg_tables t
where t.schemaname = 'public'
  and t.tablename in (
    'profiles', 'properties', 'sponsors',
    'property_sponsors', 'inquiries'
  )
order by t.tablename;
```

The supplied result was:

| Table | RLS enabled | Policy count | Owner-delete predicate |
| --- | --- | --- | --- |
| `inquiries` | true | 3 | null |
| `profiles` | true | 2 | null |
| `properties` | true | 6 | Recorded below |
| `property_sponsors` | true | 3 | null |
| `sponsors` | true | 2 | null |

The returned `properties_owner_delete_own` predicate is reproduced here with whitespace normalized:

```sql
((owner_id = ( SELECT auth.uid() AS uid))
 AND (status = ANY (ARRAY['draft'::text, 'rejected'::text]))
 AND (EXISTS (
   SELECT 1 FROM profiles
   WHERE ((profiles.id = ( SELECT auth.uid() AS uid))
     AND (profiles.role = 'property_owner'::text))
 )))
```

All five tables have RLS enabled. The 16 policies and final owner-delete predicate match the saved migrations. This supports the checklist item that the migrations can rebuild the schema in a clean environment.

## Evidence boundary

This is a hosted SQL-Editor schema rebuild, not a Supabase CLI reset or a recorded CLI migration-history operation. The final query checks table presence, RLS flags, policy counts, and one policy definition; it is not an exhaustive catalog comparison of every constraint, index, grant, or function setting.

No test Auth users, fictional seed, or live role audit was reported for the rebuild project. The separate 23-check role evidence and verified restoration in [lab5-live-evidence.json](lab5-live-evidence.json) belong to the original development project. The application build/browser evidence also belongs to that original configuration. These distinct results are not interchangeable.
