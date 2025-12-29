-- Peloton Initial Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- LAYOUTS TABLE
-- Stores screen widget configurations
-- ============================================
create table layouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  screen_type text not null check (screen_type in ('map', 'data')),
  widgets jsonb not null default '[]',
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table layouts is 'Screen widget configurations created in the web Layout Builder';
comment on column layouts.widgets is 'JSON array of widget objects with position and config';
comment on column layouts.is_active is 'Whether this layout is currently active on the mobile app';

-- ============================================
-- ROUTES TABLE
-- Stores GPX routes created in web app
-- ============================================
create table routes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  distance_m integer not null,
  elevation_gain_m integer,
  gpx_data text not null,
  waypoints jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table routes is 'GPX routes created in the web Route Builder';
comment on column routes.gpx_data is 'Complete GPX XML string';
comment on column routes.waypoints is 'JSON array of {lat, lng, name, type} waypoint objects';

-- ============================================
-- RIDES TABLE
-- Stores recorded cycling activities
-- ============================================
create table rides (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  route_id uuid references routes(id) on delete set null,
  name text,
  started_at timestamptz not null,
  ended_at timestamptz,
  distance_m integer default 0,
  elapsed_time_s integer default 0,
  moving_time_s integer default 0,
  avg_speed_ms numeric(6,2),
  max_speed_ms numeric(6,2),
  avg_power integer,
  max_power integer,
  avg_hr integer,
  max_hr integer,
  elevation_gain_m integer,
  gpx_path text,
  created_at timestamptz default now()
);

comment on table rides is 'Recorded cycling activities from the mobile app';
comment on column rides.gpx_path is 'Path to GPX file in Supabase Storage';
comment on column rides.avg_speed_ms is 'Average speed in meters per second';

-- ============================================
-- SENSORS TABLE
-- Stores paired Bluetooth sensors
-- ============================================
create table sensors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  sensor_type text not null check (sensor_type in ('heart_rate', 'power', 'cadence', 'speed', 'sram_axs')),
  ble_id text not null,
  ble_name text,
  last_connected_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, ble_id)
);

comment on table sensors is 'Paired Bluetooth sensors for the mobile app';
comment on column sensors.ble_id is 'Bluetooth device identifier';

-- ============================================
-- ROW LEVEL SECURITY
-- Users can only access their own data
-- ============================================
alter table layouts enable row level security;
alter table routes enable row level security;
alter table rides enable row level security;
alter table sensors enable row level security;

-- Layouts policies
create policy "Users can view own layouts"
  on layouts for select
  using (auth.uid() = user_id);

create policy "Users can insert own layouts"
  on layouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own layouts"
  on layouts for update
  using (auth.uid() = user_id);

create policy "Users can delete own layouts"
  on layouts for delete
  using (auth.uid() = user_id);

-- Routes policies
create policy "Users can view own routes"
  on routes for select
  using (auth.uid() = user_id);

create policy "Users can insert own routes"
  on routes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own routes"
  on routes for update
  using (auth.uid() = user_id);

create policy "Users can delete own routes"
  on routes for delete
  using (auth.uid() = user_id);

-- Rides policies
create policy "Users can view own rides"
  on rides for select
  using (auth.uid() = user_id);

create policy "Users can insert own rides"
  on rides for insert
  with check (auth.uid() = user_id);

create policy "Users can update own rides"
  on rides for update
  using (auth.uid() = user_id);

create policy "Users can delete own rides"
  on rides for delete
  using (auth.uid() = user_id);

-- Sensors policies
create policy "Users can view own sensors"
  on sensors for select
  using (auth.uid() = user_id);

create policy "Users can insert own sensors"
  on sensors for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sensors"
  on sensors for update
  using (auth.uid() = user_id);

create policy "Users can delete own sensors"
  on sensors for delete
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- Performance optimization
-- ============================================
create index layouts_user_id_idx on layouts(user_id);
create index layouts_is_active_idx on layouts(user_id, is_active) where is_active = true;

create index routes_user_id_idx on routes(user_id);
create index routes_created_at_idx on routes(user_id, created_at desc);

create index rides_user_id_idx on rides(user_id);
create index rides_started_at_idx on rides(user_id, started_at desc);
create index rides_route_id_idx on rides(route_id);

create index sensors_user_id_idx on sensors(user_id);
create index sensors_type_idx on sensors(user_id, sensor_type);

-- ============================================
-- UPDATED_AT TRIGGER
-- Automatically update updated_at timestamp
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger layouts_updated_at
  before update on layouts
  for each row execute function update_updated_at();

create trigger routes_updated_at
  before update on routes
  for each row execute function update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- For storing GPX files from rides
-- ============================================
-- Run this in the Supabase Dashboard under Storage
-- Or use the Supabase CLI

-- insert into storage.buckets (id, name, public)
-- values ('rides', 'rides', false);

-- create policy "Users can upload own ride files"
--   on storage.objects for insert
--   with check (bucket_id = 'rides' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "Users can view own ride files"
--   on storage.objects for select
--   using (bucket_id = 'rides' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "Users can delete own ride files"
--   on storage.objects for delete
--   using (bucket_id = 'rides' and auth.uid()::text = (storage.foldername(name))[1]);
