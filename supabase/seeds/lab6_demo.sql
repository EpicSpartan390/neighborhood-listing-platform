-- Lab 6 fictional demonstration data.
-- Requires the fictional Auth user lab6.owner@example.com.
-- Contains no password, secret, or real personal data.

begin;

do $$
declare
  demo_owner_id uuid;
begin
  select id
  into demo_owner_id
  from auth.users
  where email = 'lab6.owner@example.com';

  if demo_owner_id is null then
    raise exception
      'Create the fictional Auth user lab6.owner@example.com first.';
  end if;

  insert into public.profiles(id, role)
  values (demo_owner_id, 'property_owner')
  on conflict (id)
  do update set role = excluded.role;

  insert into public.properties(
    id,
    owner_id,
    address,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    status,
    postal_code
  )
  values
    (
      '10000000-0000-4000-8000-000000009032',
      demo_owner_id,
      'Fictional Lab 6 Property - ZIP 90032',
      650000,
      3,
      2,
      1450,
      'approved',
      '90032'
    ),
    (
      '10000000-0000-4000-8000-000000009031',
      demo_owner_id,
      'Fictional Lab 6 Property - ZIP 90031',
      525000,
      2,
      1,
      1050,
      'approved',
      '90031'
    ),
    (
      '10000000-0000-4000-8000-000000009033',
      demo_owner_id,
      'Fictional Lab 6 Property - ZIP 90033',
      475000,
      2,
      2,
      1150,
      'approved',
      '90033'
    )
  on conflict (id)
  do update set
    owner_id = excluded.owner_id,
    address = excluded.address,
    price = excluded.price,
    bedrooms = excluded.bedrooms,
    bathrooms = excluded.bathrooms,
    square_feet = excluded.square_feet,
    status = excluded.status,
    postal_code = excluded.postal_code;
end;
$$;

insert into public.sponsors(
  id,
  name,
  tier,
  active_status,
  status,
  placement,
  start_date,
  end_date,
  home_postal_code,
  radius_miles,
  priority,
  daily_impression_cap,
  destination_url,
  description,
  image_path,
  image_alt
)
values
  (
    '20000000-0000-4000-8000-0000000000a1'::uuid,
    'Sponsor A - Fictional Silver Market',
    'silver',
    true,
    'APPROVED',
    'PROPERTY_DETAIL',
    current_date - 30,
    current_date + 365,
    '90032',
    5,
    10,
    500,
    'https://example.com/sponsor-a',
    'A fictional silver neighborhood market.',
    '/sponsor-market.svg',
    'Illustration for fictional Sponsor A'
  ),
  (
    '20000000-0000-4000-8000-0000000000b2'::uuid,
    'Sponsor B - Fictional Gold Repair',
    'gold',
    true,
    'APPROVED',
    'PROPERTY_DETAIL',
    current_date - 30,
    current_date + 365,
    '90032',
    5,
    20,
    500,
    'https://example.com/sponsor-b',
    'A fictional gold home-repair business.',
    '/sponsor-repair.svg',
    'Illustration for fictional Sponsor B'
  ),
  (
    '20000000-0000-4000-8000-0000000000c3'::uuid,
    'Sponsor C - Fictional Gold Market',
    'gold',
    true,
    'APPROVED',
    'PROPERTY_DETAIL',
    current_date - 30,
    current_date + 365,
    '90032',
    5,
    20,
    500,
    'https://example.com/sponsor-c',
    'A fictional gold neighborhood market.',
    '/sponsor-market.svg',
    'Illustration for fictional Sponsor C'
  ),
  (
    '20000000-0000-4000-8000-0000000000d4'::uuid,
    'Sponsor D - Fictional Pending Platinum',
    'platinum',
    true,
    'PENDING',
    'PROPERTY_DETAIL',
    current_date - 30,
    current_date + 365,
    '90032',
    5,
    100,
    500,
    'https://example.com/sponsor-d',
    'A fictional pending platinum campaign.',
    '/sponsor-repair.svg',
    'Illustration for fictional Sponsor D'
  ),
  (
    '20000000-0000-4000-8000-0000000000e5'::uuid,
    'Sponsor E - Fictional Gold Community Cafe',
    'gold',
    true,
    'APPROVED',
    'PROPERTY_DETAIL',
    current_date - 30,
    current_date + 365,
    '90031',
    3,
    15,
    500,
    'https://example.com/sponsor-e',
    'A fictional gold community cafe.',
    '/sponsor-market.svg',
    'Illustration for fictional Sponsor E'
  ),
  (
    '20000000-0000-4000-8000-0000000000f6'::uuid,
    'Sponsor F - Fictional Expired Bronze',
    'bronze',
    true,
    'APPROVED',
    'PROPERTY_DETAIL',
    current_date - 365,
    current_date - 1,
    '90033',
    3,
    10,
    500,
    'https://example.com/sponsor-f',
    'A fictional expired bronze campaign.',
    '/sponsor-repair.svg',
    'Illustration for fictional Sponsor F'
  )
on conflict (id)
do update set
  name = excluded.name,
  tier = excluded.tier,
  active_status = excluded.active_status,
  status = excluded.status,
  placement = excluded.placement,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  home_postal_code = excluded.home_postal_code,
  radius_miles = excluded.radius_miles,
  priority = excluded.priority,
  daily_impression_cap =
    excluded.daily_impression_cap,
  destination_url = excluded.destination_url,
  description = excluded.description,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt;

insert into public.sponsor_zip_coverage(
  sponsor_id,
  postal_code,
  distance_miles
)
values
  (
    '20000000-0000-4000-8000-0000000000a1'::uuid,
    '90032',
    0.4
  ),
  (
    '20000000-0000-4000-8000-0000000000b2'::uuid,
    '90032',
    1.2
  ),
  (
    '20000000-0000-4000-8000-0000000000c3'::uuid,
    '90032',
    0.8
  ),
  (
    '20000000-0000-4000-8000-0000000000d4'::uuid,
    '90032',
    0.2
  ),
  (
    '20000000-0000-4000-8000-0000000000e5'::uuid,
    '90031',
    0.3
  ),
  (
    '20000000-0000-4000-8000-0000000000f6'::uuid,
    '90033',
    0.1
  )
on conflict (sponsor_id, postal_code)
do update set
  distance_miles = excluded.distance_miles;

-- Reset only today's events for these six fictional IDs.
delete from public.sponsor_impressions
where sponsor_id in (
  '20000000-0000-4000-8000-0000000000a1'::uuid,
  '20000000-0000-4000-8000-0000000000b2'::uuid,
  '20000000-0000-4000-8000-0000000000c3'::uuid,
  '20000000-0000-4000-8000-0000000000d4'::uuid,
  '20000000-0000-4000-8000-0000000000e5'::uuid,
  '20000000-0000-4000-8000-0000000000f6'::uuid
)
and occurred_at >=
  (current_date::timestamp at time zone 'UTC')
and occurred_at <
  (
    (current_date + 1)::timestamp
    at time zone 'UTC'
  );

insert into public.sponsor_impressions(
  sponsor_id,
  placement,
  occurred_at,
  page_context
)
select
  demo.sponsor_id,
  'PROPERTY_DETAIL',
  now(),
  'property_detail'
from (
  values
    (
      '20000000-0000-4000-8000-0000000000a1'::uuid,
      120
    ),
    (
      '20000000-0000-4000-8000-0000000000b2'::uuid,
      45
    ),
    (
      '20000000-0000-4000-8000-0000000000c3'::uuid,
      90
    ),
    (
      '20000000-0000-4000-8000-0000000000e5'::uuid,
      10
    )
) as demo(sponsor_id, impression_count)
cross join lateral generate_series(
  1,
  demo.impression_count
);

commit;