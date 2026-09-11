-- Momentum's first user-owned data model.
-- Run this migration in the Supabase SQL Editor before testing authentication.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_program_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  start_date date,
  completed_exercises jsonb not null default '{}'::jsonb
    check (jsonb_typeof(completed_exercises) = 'object'),
  swapped_workout jsonb
    check (swapped_workout is null or jsonb_typeof(swapped_workout) = 'object'),
  saved_workouts text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_program_state_set_updated_at on public.user_program_state;
create trigger user_program_state_set_updated_at
before update on public.user_program_state
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill a profile if an account was created before this migration ran.
insert into public.profiles (id, display_name)
select
  id,
  coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.user_program_state enable row level security;

drop policy if exists "Users can manage their own profile" on public.profiles;
create policy "Users can manage their own profile"
on public.profiles
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can manage their own program state" on public.user_program_state;
create policy "Users can manage their own program state"
on public.user_program_state
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon;
revoke all on table public.user_program_state from anon;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_program_state to authenticated;

