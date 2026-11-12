-- Lab 6 prepared migration: contextual sponsor eligibility and restrained telemetry.
-- Review before copying to the working repository or applying to Supabase.

begin;

-- Existing rows remain pending until an administrator supplies complete campaign data.
alter table public.sponsors
  drop constraint if exists sponsors_tier_check;

alter table public.sponsors
  add constraint sponsors_tier_check
    check (tier in ('platinum', 'gold', 'silver', 'bronze')),
  add column status text not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'REJECTED', 'PAUSED')),
  add column placement text,
  add column start_date date,
  add column end_date date,
  add column home_postal_code text,
  add column radius_miles numeric(6, 2),
  add column priority integer not null default 0,
  add column daily_impression_cap integer,
  add column destination_url text,
  add column description text,
  add column image_path text,
  add column image_alt text,
  add constraint sponsors_campaign_dates_check
    check (end_date is null or start_date is null or end_date >= start_date),
  add constraint sponsors_home_postal_code_check
    check (home_postal_code is null or home_postal_code ~ '^[0-9]{5}$'),
  add constraint sponsors_radius_miles_check
    check (radius_miles is null or radius_miles >= 0),
  add constraint sponsors_daily_impression_cap_check
    check (daily_impression_cap is null or daily_impression_cap > 0),
  add constraint sponsors_approved_fields_check
    check (
      status <> 'APPROVED'
      or (
        placement is not null
        and start_date is not null
        and home_postal_code is not null
        and radius_miles is not null
        and destination_url is not null
        and destination_url ~* '^https://([a-z0-9-]+\.)+[a-z]{2,}([/:?#].*)?$'
        and image_alt is not null
      )
    );

alter table public.properties
  add column postal_code text
    check (postal_code is null or postal_code ~ '^[0-9]{5}$');

create table public.sponsor_zip_coverage (
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  distance_miles numeric(6, 2) not null check (distance_miles >= 0),
  primary key (sponsor_id, postal_code)
);

create table public.sponsor_impressions (
  id bigint generated always as identity primary key,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  placement text not null,
  occurred_at timestamptz not null default timezone('utc'::text, now()),
  page_context text not null
    check (page_context in ('property_detail', 'property_list', 'house_fallback'))
);

create index sponsors_eligibility_idx
  on public.sponsors (status, active_status, placement, start_date, end_date);
create index sponsor_zip_coverage_lookup_idx
  on public.sponsor_zip_coverage (postal_code, distance_miles, sponsor_id);
create index sponsor_impressions_daily_idx
  on public.sponsor_impressions (sponsor_id, occurred_at);
create index properties_postal_code_idx
  on public.properties (postal_code);

alter table public.sponsor_zip_coverage enable row level security;
alter table public.sponsor_impressions enable row level security;

-- Replace the older active-only public rule with complete campaign eligibility.
drop policy if exists "sponsors_public_select_active" on public.sponsors;
create policy "sponsors_public_select_eligible"
on public.sponsors for select
to anon, authenticated
using (
  active_status = true
  and status = 'APPROVED'
  and current_date >= start_date
  and (end_date is null or current_date <= end_date)
);


-- Sponsor links must follow the same complete eligibility rules.
drop policy if exists "property_sponsors_public_select_approved"
on public.property_sponsors;

create policy "property_sponsors_public_select_approved"
on public.property_sponsors for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_sponsors.property_id
      and properties.status = 'approved'
  )
  and exists (
    select 1
    from public.sponsors
    where sponsors.id = property_sponsors.sponsor_id
      and sponsors.active_status = true
      and sponsors.status = 'APPROVED'
      and current_date >= sponsors.start_date
      and (
        sponsors.end_date is null
        or current_date <= sponsors.end_date
      )
  )
);

create policy "sponsor_zip_coverage_public_select"
on public.sponsor_zip_coverage for select
to anon, authenticated
using (
  exists (
    select 1
    from public.sponsors
    where sponsors.id = sponsor_zip_coverage.sponsor_id
      and sponsors.active_status = true
      and sponsors.status = 'APPROVED'
      and current_date >= sponsors.start_date
      and (sponsors.end_date is null or current_date <= sponsors.end_date)
  )
);

create policy "sponsor_zip_coverage_admin_all"
on public.sponsor_zip_coverage for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

create policy "sponsor_impressions_public_insert"
on public.sponsor_impressions for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.sponsors
    where sponsors.id = sponsor_impressions.sponsor_id
      and sponsors.active_status = true
      and sponsors.status = 'APPROVED'
      and sponsors.placement = sponsor_impressions.placement
      and current_date >= sponsors.start_date
      and (sponsors.end_date is null or current_date <= sponsors.end_date)
  )
);

create policy "sponsor_impressions_admin_select"
on public.sponsor_impressions for select
to authenticated
using (public.is_exam_admin());

grant select on public.sponsor_zip_coverage to anon, authenticated;
grant insert on public.sponsor_impressions to anon, authenticated;
grant select, insert, update, delete
  on public.sponsor_zip_coverage, public.sponsor_impressions
  to authenticated;
grant usage, select on sequence public.sponsor_impressions_id_seq
  to anon, authenticated;

-- Return only eligible candidates and the public fields required by the
-- pure selector and disclosure UI. Internal campaign notes are not exposed.
create or replace function public.get_eligible_sponsors(
  p_property_id uuid,
  p_placement text,
  p_on_date date default current_date
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
  select
    sponsors.id as sponsor_id,
    sponsors.name as sponsor_name,
    sponsors.tier,
    sponsors.destination_url,
    sponsors.description as sponsor_description,
    sponsors.image_path,
    sponsors.image_alt,
    sponsor_zip_coverage.distance_miles,
    daily_counts.impression_count as daily_impressions,
    sponsors.priority
  from public.properties
  join public.sponsor_zip_coverage
    on sponsor_zip_coverage.postal_code = properties.postal_code
  join public.sponsors
    on sponsors.id = sponsor_zip_coverage.sponsor_id
  cross join lateral (
    select count(*)::bigint as impression_count
    from public.sponsor_impressions
    where sponsor_impressions.sponsor_id = sponsors.id
      and sponsor_impressions.placement = p_placement
      and sponsor_impressions.occurred_at >=
        (p_on_date::timestamp at time zone 'UTC')
      and sponsor_impressions.occurred_at <
        ((p_on_date + 1)::timestamp at time zone 'UTC')
  ) as daily_counts
  where properties.id = p_property_id
    and properties.status = 'approved'
    and sponsors.status = 'APPROVED'
    and sponsors.active_status = true
    and sponsors.placement = p_placement
    and p_on_date >= sponsors.start_date
    and (
      sponsors.end_date is null
      or p_on_date <= sponsors.end_date
    )
    and sponsor_zip_coverage.distance_miles <= sponsors.radius_miles
    and (
      sponsors.daily_impression_cap is null
      or daily_counts.impression_count < sponsors.daily_impression_cap
    )
  order by sponsors.id;
$$;

revoke all
on function public.get_eligible_sponsors(uuid, text, date)
from public;

grant execute
on function public.get_eligible_sponsors(uuid, text, date)
to anon, authenticated;

commit;
