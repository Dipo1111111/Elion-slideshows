-- Elion — Supabase schema (see BUILD_PLAN §5).
-- Applied in the Supabase SQL editor. Server uses the service-role client,
-- which bypasses RLS; RLS below is defense in depth for direct access.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'creator', 'studio', 'pro')),
  total_gens int not null default 0,        -- free = 3 lifetime (all projects share the quota)
  monthly_gens int not null default 0,      -- creator/studio = X/month (month-windowed)
  month_start timestamptz not null default now(),
  ls_subscription_id text,                  -- Lemon Squeezy ref (idempotent webhook)
  created_at timestamptz not null default now()
);

-- Brand voices live on projects. Free = 1, Creator = 3, Studio = 10 (project cap = plan).
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My brand',
  brain jsonb not null default '{}'::jsonb, -- {niche, appName, appDescription, audience, styleMemory}
  imagePacks jsonb not null default '[]'::jsonb, -- [{id, url, pulledAt}] reusable background pool (Pinterest pulls)
  created_at timestamptz not null default now()
);
create index on public.projects (user_id, created_at desc);

create table public.queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  data jsonb not null,   -- Slideshow {id, hook, caption, hashtags[], slides[], rationale, createdAt}
  created_at timestamptz not null default now()
);
create index on public.queue (user_id, project_id, created_at desc);

-- Auto-create a profile row + a default project on signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  insert into public.projects (user_id, name)
  values (new.id, 'My brand');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS (defense in depth; server uses service role which bypasses)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.queue enable row level security;

create policy "own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "own projects" on public.projects
  for all to authenticated using (user_id = auth.uid());
create policy "own queue" on public.queue
  for all to authenticated using (user_id = auth.uid());
