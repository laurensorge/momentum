-- Shared preferences. Nullable additions preserve legacy onboarding answers.
alter table public.profiles
  add column if not exists training_days text[],
  add column if not exists session_length text,
  add column if not exists focus_areas text[];

alter table public.profiles add constraint profiles_training_days_valid check (
  training_days is null or (cardinality(training_days) between 1 and 7 and
  training_days <@ array['Sun','Mon','Tue','Wed','Thu','Fri','Sat']::text[]));
alter table public.profiles add constraint profiles_session_length_valid check (
  session_length is null or session_length in ('20–30','30–40','40–50','50–60'));
alter table public.profiles add constraint profiles_focus_areas_valid check (
  focus_areas is null or focus_areas <@ array['Shoulders','Chest','Back','Arms','Abs','Glutes','Quads','Hamstrings','Calves']::text[]);

-- Each assignment keeps its own preferences and complete four-week prescription.
-- This table is prepared for the program engine; preference edits do not create assignments.
create table public.program_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_key text not null,
  template_version integer not null check (template_version > 0),
  status text not null check (status in ('active','scheduled','completed','switched','cancelled')),
  starts_on date not null,
  ended_at timestamptz,
  preferences jsonb not null check (jsonb_typeof(preferences) = 'object'),
  prescription jsonb not null check (jsonb_typeof(prescription) = 'object'),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create unique index one_active_program_per_user on public.program_assignments(user_id) where status = 'active';
create unique index one_scheduled_program_per_user on public.program_assignments(user_id) where status = 'scheduled';
create index program_history_by_user on public.program_assignments(user_id, created_at desc);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assignment_id uuid not null,
  session_key text not null,
  scheduled_on date not null,
  started_at timestamptz,
  completed_at timestamptz,
  prescription jsonb not null check (jsonb_typeof(prescription) = 'object'),
  performance jsonb not null default '{}'::jsonb check (jsonb_typeof(performance) = 'object'),
  foreign key (assignment_id, user_id) references public.program_assignments(id, user_id),
  unique (assignment_id, session_key)
);
alter table public.program_assignments enable row level security;
alter table public.workout_sessions enable row level security;
create policy "Own program assignments" on public.program_assignments for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own workout sessions" on public.workout_sessions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.program_assignments, public.workout_sessions from anon;
grant select, insert, update, delete on public.program_assignments, public.workout_sessions to authenticated;
