-- Route Collections Schema
-- Allows users to organize routes into collections (like playlists)

-- ============================================
-- ROUTE COLLECTIONS TABLE
-- Stores user-created collections for organizing routes
-- ============================================
create table route_collections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table route_collections is 'User-created collections for organizing routes';

-- ============================================
-- COLLECTION ROUTES JUNCTION TABLE
-- Many-to-many relationship between routes and collections
-- ============================================
create table collection_routes (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid references route_collections(id) on delete cascade not null,
  route_id uuid references routes(id) on delete cascade not null,
  position integer not null default 0,
  added_at timestamptz default now(),

  -- Prevent duplicate route entries in same collection
  unique(collection_id, route_id)
);

comment on table collection_routes is 'Junction table linking routes to collections with ordering';
comment on column collection_routes.position is 'Manual sort order within collection (0-indexed)';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table route_collections enable row level security;
alter table collection_routes enable row level security;

-- Collections policies (user owns the collection)
create policy "Users can view own collections"
  on route_collections for select
  using (auth.uid() = user_id);

create policy "Users can insert own collections"
  on route_collections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own collections"
  on route_collections for update
  using (auth.uid() = user_id);

create policy "Users can delete own collections"
  on route_collections for delete
  using (auth.uid() = user_id);

-- Collection routes policies (user must own the parent collection)
create policy "Users can view own collection routes"
  on collection_routes for select
  using (
    exists (
      select 1 from route_collections
      where id = collection_routes.collection_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert into own collections"
  on collection_routes for insert
  with check (
    exists (
      select 1 from route_collections
      where id = collection_routes.collection_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update own collection routes"
  on collection_routes for update
  using (
    exists (
      select 1 from route_collections
      where id = collection_routes.collection_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete from own collections"
  on collection_routes for delete
  using (
    exists (
      select 1 from route_collections
      where id = collection_routes.collection_id
      and user_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES
-- ============================================
create index route_collections_user_id_idx on route_collections(user_id);
create index route_collections_created_at_idx on route_collections(user_id, created_at desc);

create index collection_routes_collection_id_idx on collection_routes(collection_id);
create index collection_routes_route_id_idx on collection_routes(route_id);
create index collection_routes_position_idx on collection_routes(collection_id, position);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create trigger route_collections_updated_at
  before update on route_collections
  for each row execute function update_updated_at();
