-- Lab 5: owners may remove only their own draft/rejected listings.
-- Prerequisite: both 20261029 examination migrations have been applied.
-- This changes one policy; it does not delete or rewrite any records.
begin;

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

-- Existing authenticated-admin policies remain independent of this owner rule.
-- Trusted service-role access still bypasses RLS.
commit;
