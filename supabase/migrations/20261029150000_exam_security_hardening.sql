-- Follow-up to the already committed examination migration. No data is deleted.
begin;

-- Fully qualified names in this helper permit an empty, fixed search path.
alter function public.is_exam_admin() set search_path = '';
revoke all on function public.is_exam_admin() from public, anon;
grant execute on function public.is_exam_admin() to authenticated, service_role;

-- Remove inherited default API privileges, including TRUNCATE/REFERENCES/TRIGGER.
-- RLS does not protect TRUNCATE. Grant only operations used by this subsystem.
revoke all on public.profiles, public.sponsors, public.properties,
  public.property_sponsors, public.inquiries from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;
grant select on public.properties, public.sponsors, public.property_sponsors to anon;
grant insert on public.inquiries to anon;
grant select, insert, update, delete on public.profiles, public.sponsors,
  public.properties, public.property_sponsors, public.inquiries to authenticated, service_role;

-- Ownership alone is insufficient if an account's owner role has been revoked.
-- Administrator access remains covered by the original admin policies.
drop policy "properties_owner_select_own" on public.properties;
create policy "properties_owner_select_own" on public.properties for select to authenticated
using (
  owner_id = (select auth.uid())
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

drop policy "properties_owner_insert_draft" on public.properties;
create policy "properties_owner_insert_draft" on public.properties for insert to authenticated
with check (
  owner_id = (select auth.uid()) and status = 'draft'
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

drop policy "properties_owner_update_unapproved" on public.properties;
create policy "properties_owner_update_unapproved" on public.properties for update to authenticated
using (
  owner_id = (select auth.uid()) and status in ('draft', 'rejected')
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
)
with check (
  owner_id = (select auth.uid()) and status in ('draft', 'rejected')
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

drop policy "properties_owner_delete_own" on public.properties;
create policy "properties_owner_delete_own" on public.properties for delete to authenticated
using (
  owner_id = (select auth.uid())
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'property_owner')
);

commit;
