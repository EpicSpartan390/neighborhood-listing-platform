-- Midterm practical: Property Listings & Inquiries persistence and access control.
-- Apply once through the Supabase migration workflow.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'property_owner', 'sponsor', 'public')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2),
  tier text not null check (tier in ('gold', 'silver', 'bronze')),
  active_status boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  address text not null,
  price numeric(12, 2) not null check (price >= 0),
  bedrooms integer not null check (bedrooms >= 0),
  bathrooms numeric(3, 1) not null check (bathrooms >= 0),
  square_feet integer not null check (square_feet > 0),
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.property_sponsors (
  property_id uuid references public.properties(id) on delete cascade,
  sponsor_id uuid references public.sponsors(id) on delete cascade,
  primary key (property_id, sponsor_id)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  inquirer_email text not null
    check (inquirer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text not null check (char_length(message) >= 10),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index properties_owner_id_idx on public.properties(owner_id);
create index properties_status_idx on public.properties(status);
create index property_sponsors_sponsor_id_idx on public.property_sponsors(sponsor_id);
create index inquiries_property_id_idx on public.inquiries(property_id);

-- SECURITY DEFINER avoids recursive profiles RLS checks while evaluating admin policies.
create or replace function public.is_exam_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_exam_admin() from public;
grant execute on function public.is_exam_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.sponsors enable row level security;
alter table public.properties enable row level security;
alter table public.property_sponsors enable row level security;
alter table public.inquiries enable row level security;

-- Profiles: users may see their own role; administrators have full audit access.
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "profiles_admin_all"
on public.profiles for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- Sponsors: only active sponsors are public; administrators manage all sponsors.
create policy "sponsors_public_select_active"
on public.sponsors for select
to anon, authenticated
using (active_status = true);

create policy "sponsors_admin_all"
on public.sponsors for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- Properties: public visibility is approved-only.
create policy "properties_public_select_approved"
on public.properties for select
to anon, authenticated
using (status = 'approved');

create policy "properties_owner_select_own"
on public.properties for select
to authenticated
using (owner_id = auth.uid());

create policy "properties_owner_insert_draft"
on public.properties for insert
to authenticated
with check (
  owner_id = auth.uid()
  and status = 'draft'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'property_owner'
  )
);

create policy "properties_owner_update_unapproved"
on public.properties for update
to authenticated
using (
  owner_id = auth.uid()
  and status in ('draft', 'rejected')
)
with check (
  owner_id = auth.uid()
  and status in ('draft', 'rejected')
);

create policy "properties_owner_delete_own"
on public.properties for delete
to authenticated
using (owner_id = auth.uid());

create policy "properties_admin_all"
on public.properties for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- Sponsor links reveal only approved properties connected to active sponsors.
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
  )
);

create policy "property_sponsors_owner_select_own"
on public.property_sponsors for select
to authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_sponsors.property_id
      and properties.owner_id = auth.uid()
  )
);

create policy "property_sponsors_admin_all"
on public.property_sponsors for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- Anyone can submit an inquiry. No general SELECT policy is defined.
create policy "inquiries_public_insert"
on public.inquiries for insert
to anon, authenticated
with check (true);

create policy "inquiries_property_owner_select"
on public.inquiries for select
to authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = inquiries.property_id
      and properties.owner_id = auth.uid()
  )
);

create policy "inquiries_admin_all"
on public.inquiries for all
to authenticated
using (public.is_exam_admin())
with check (public.is_exam_admin());

-- SQL privileges and RLS work together: grants permit an operation category;
-- policies decide which rows each actor may access.
grant usage on schema public to anon, authenticated;
grant select on public.properties, public.sponsors, public.property_sponsors to anon;
grant insert on public.inquiries to anon;

grant select, insert, update, delete
  on public.profiles,
     public.sponsors,
     public.properties,
     public.property_sponsors,
     public.inquiries
  to authenticated;

