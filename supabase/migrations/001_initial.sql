-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  github_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Rices
create table public.rices (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  wm text not null,
  distro text not null default '',
  tags text[] not null default '{}',
  dots_url text,
  downloads integer not null default 0,
  created_at timestamptz default now() not null
);

alter table public.rices enable row level security;

create policy "Rices are publicly readable"
  on public.rices for select using (true);

create policy "Authenticated users can create rices"
  on public.rices for insert with check (auth.uid() = author_id);

create policy "Users can update own rices"
  on public.rices for update using (auth.uid() = author_id);

create policy "Users can delete own rices"
  on public.rices for delete using (auth.uid() = author_id);

-- Screenshots
create table public.screenshots (
  id uuid primary key default gen_random_uuid(),
  rice_id uuid not null references public.rices(id) on delete cascade,
  storage_path text not null,
  display_order integer not null default 0,
  created_at timestamptz default now() not null
);

alter table public.screenshots enable row level security;

create policy "Screenshots are publicly readable"
  on public.screenshots for select using (true);

create policy "Rice authors can manage screenshots"
  on public.screenshots for insert
  with check (
    auth.uid() = (select author_id from public.rices where id = rice_id)
  );

create policy "Rice authors can delete screenshots"
  on public.screenshots for delete
  using (
    auth.uid() = (select author_id from public.rices where id = rice_id)
  );

-- Tips
create table public.tips (
  id uuid primary key default gen_random_uuid(),
  rice_id uuid not null references public.rices(id) on delete cascade,
  tipper_id uuid references public.profiles(id) on delete set null,
  amount integer not null default 1,
  message text,
  created_at timestamptz default now() not null
);

alter table public.tips enable row level security;

create policy "Tips are publicly readable"
  on public.tips for select using (true);

create policy "Authenticated users can tip"
  on public.tips for insert with check (auth.uid() = tipper_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Indexes
create index rices_author_id_idx on public.rices(author_id);
create index rices_wm_idx on public.rices(wm);
create index rices_created_at_idx on public.rices(created_at desc);
create index screenshots_rice_id_idx on public.screenshots(rice_id);
create index tips_rice_id_idx on public.tips(rice_id);
