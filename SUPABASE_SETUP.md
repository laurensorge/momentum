# Momentum Supabase setup

## Apply the database migration

1. Open the Momentum project in Supabase.
2. Select **SQL Editor** in the left sidebar.
3. Select **New query**.
4. Copy all of `supabase/migrations/202609110001_initial_user_data.sql` into the editor.
5. Select **Run**.
6. Create another query, copy all of `supabase/migrations/202609110002_onboarding_preferences.sql`, and select **Run** again.

The migration creates:

- `profiles`, for account display names;
- `user_program_state`, for program start date, completed exercises, workout swaps, and saved workouts;
- Row Level Security policies that limit every record to its signed-in owner.
- onboarding answers and the generated personalized weekly-plan blueprint.

## Authentication behavior

Momentum uses Supabase email/password authentication. If email confirmation is enabled in Supabase, a new member must click the confirmation link before signing in.

The first time an existing local Momentum user signs in, browser-only progress is copied into their Supabase record and then removed from shared browser storage.
