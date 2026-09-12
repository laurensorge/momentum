-- The existing text[] column accepts Full gym access without a schema change.
-- Rename the legacy label without adding equipment the user has not confirmed.
update public.profiles
set available_equipment = array(
  select distinct case when item = 'Gym Membership' then 'Full gym access' else item end
  from unnest(available_equipment) as item
)
where 'Gym Membership' = any(available_equipment);
-- Historical program prescriptions intentionally remain unchanged.
