-- Additive: existing workout checkoffs and user-owned RLS policies remain unchanged.
alter table public.user_program_state
  add column if not exists completion_records jsonb not null default '{}'::jsonb
  check (jsonb_typeof(completion_records) = 'object');
