-- Lab 6 adversarial hardening:
-- public callers cannot inspect eligibility for arbitrary dates.

begin;

revoke execute
on function public.get_eligible_sponsors(uuid, text, date)
from anon, authenticated;

create or replace function public.get_current_eligible_sponsors(
  p_property_id uuid,
  p_placement text
)
returns table (
  sponsor_id uuid,
  sponsor_name text,
  tier text,
  destination_url text,
  sponsor_description text,
  image_path text,
  image_alt text,
  distance_miles numeric,
  daily_impressions bigint,
  priority integer
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select *
  from public.get_eligible_sponsors(
    p_property_id,
    p_placement,
    current_date
  );
$$;

revoke all
on function public.get_current_eligible_sponsors(uuid, text)
from public;

grant execute
on function public.get_current_eligible_sponsors(uuid, text)
to anon, authenticated;

commit;