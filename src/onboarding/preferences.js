export const TRAINING_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const SESSION_LENGTHS = ['20–30', '30–40', '40–50', '50–60'];
export const AVAILABLE_EQUIPMENT = ['Full gym access', 'Dumbbells', 'Resistance Bands', 'Kettlebells', 'Barbell', 'Bench', 'Cable Machine', 'Weight Machines', 'Pull-Up Bar', 'Treadmill', 'Bike', 'Yoga Mat', 'Jump Rope', 'Foam Roller', 'Medicine Ball'];
export const GYM_EQUIPMENT = ['Dumbbells', 'Barbell', 'Bench', 'Cable Machine', 'Weight Machines', 'Treadmill', 'Bike'];
export function toggleEquipment(equipment, item) {
  if (item === 'Full gym access' && !equipment.includes(item)) {
    return AVAILABLE_EQUIPMENT.filter(value => value === item || equipment.includes(value) || GYM_EQUIPMENT.includes(value));
  }
  return AVAILABLE_EQUIPMENT.filter(value => value === item ? !equipment.includes(value) : equipment.includes(value));
}
const legacyDays = { '1_2_days': ['Mon', 'Thu'], '3_4_days': ['Mon', 'Tue', 'Thu', 'Sat'], '5_6_days': ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'], every_day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

export function preferencesFromProfile(profile = {}) {
  profile = profile || {};
  return {
    goal: profile.fitness_goal || 'general_fitness',
    level: profile.fitness_level || 'beginner',
    activities: profile.preferred_activities || [],
    equipment: [...new Set((profile.available_equipment || []).map(item => item === 'Gym Membership' ? 'Full gym access' : item))],
    focus: profile.focus_areas ?? profile.personalized_plan?.focus_areas ?? [],
    days: profile.training_days ?? legacyDays[profile.workout_frequency] ?? ['Mon', 'Wed', 'Fri'],
    time: profile.session_length || '30–40',
  };
}

export function preferenceFields(answers) {
  if (!Array.isArray(answers.days) || !answers.days.length || answers.days.some(day => !TRAINING_DAYS.includes(day))) throw new Error('Choose at least one training day.');
  if (!SESSION_LENGTHS.includes(answers.time)) throw new Error('Choose a session length.');
  return {
    fitness_goal: answers.goal, fitness_level: answers.level,
    preferred_activities: answers.activities, available_equipment: answers.equipment,
    focus_areas: answers.focus, training_days: TRAINING_DAYS.filter(day => answers.days.includes(day)),
    session_length: answers.time,
    workout_frequency: answers.days.length <= 2 ? '1_2_days' : answers.days.length <= 4 ? '3_4_days' : answers.days.length <= 6 ? '5_6_days' : 'every_day',
  };
}
