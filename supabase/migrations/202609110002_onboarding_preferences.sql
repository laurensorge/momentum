-- Store the answers used to build each member's personalized plan.

alter table public.profiles
  add column if not exists fitness_goal text,
  add column if not exists fitness_level text,
  add column if not exists preferred_activities text[] not null default '{}',
  add column if not exists available_equipment text[] not null default '{}',
  add column if not exists workout_frequency text,
  add column if not exists personalized_plan jsonb,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  drop constraint if exists profiles_fitness_goal_check,
  add constraint profiles_fitness_goal_check check (
    fitness_goal is null or fitness_goal in (
      'weight_loss', 'build_muscle', 'improve_endurance', 'enhance_flexibility', 'general_fitness'
    )
  ),
  drop constraint if exists profiles_fitness_level_check,
  add constraint profiles_fitness_level_check check (
    fitness_level is null or fitness_level in ('beginner', 'intermediate', 'advanced')
  ),
  drop constraint if exists profiles_workout_frequency_check,
  add constraint profiles_workout_frequency_check check (
    workout_frequency is null or workout_frequency in ('1_2_days', '3_4_days', '5_6_days', 'every_day')
  ),
  drop constraint if exists profiles_personalized_plan_check,
  add constraint profiles_personalized_plan_check check (
    personalized_plan is null or jsonb_typeof(personalized_plan) = 'object'
  );

