import { preferencesFromProfile, TRAINING_DAYS } from '../onboarding/preferences.js';

export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export function addDays(date, days) { const result = new Date(`${date}T12:00:00`); result.setDate(result.getDate() + days); return localDate(result); }
export function supportsFoundations(profile) {
  const p = preferencesFromProfile(profile);
  if (!profile.training_days || !profile.session_length) return false;
  const days = TRAINING_DAYS.filter(day => p.days.includes(day));
  const gap = (TRAINING_DAYS.indexOf(days[0]) + 7 - TRAINING_DAYS.indexOf(days[2])) % 7;
  return p.goal === 'general_fitness' && p.level === 'beginner' && days.length === 3 && gap > 1 && p.time === '30–40' && p.equipment.includes('Dumbbells') && p.focus.length === 0 && (p.activities.length === 0 || p.activities.every(activity => ['Walking', 'Weightlifting', 'Home Workouts'].includes(activity)));
}
const exercise = (name, sets, reps, notes) => ({ name, sets, reps, notes });
export function createFoundations(profile, startsOn = localDate()) {
  if (!supportsFoundations(profile)) throw new Error('This program does not match the selected preferences yet.');
  const p = preferencesFromProfile(profile);
  const days = TRAINING_DAYS.filter(day => p.days.includes(day));
  // Align a complete four-week calendar to the next first selected weekday.
  const firstDay = TRAINING_DAYS.indexOf(days[0]);
  const start = addDays(startsOn, (firstDay - new Date(`${startsOn}T12:00:00`).getDay() + 7) % 7);
  const sessions = [];
  for (let week = 0; week < 4; week++) {
    const n = Math.min(week, 2);
    const reps = 8 + n * 2;
    const guidance = 'Leave about 3 controlled reps available. Repeat the last manageable workload if today’s target is too difficult.';
    const press = exercise('Dumbbell floor press', 2, reps, 'Rest 90 seconds. Lower upper arms gently to the floor.');
    const row = exercise('Supported one-arm dumbbell row', 2, `${reps}/side`, 'Rest 60–90 seconds after both sides. Keep torso steady.');
    const workouts = [
      { title: 'Full Body Foundations', image: '/images/workout-full-body-light-v2.png', duration: '30–40 min', guidance, exercises: [exercise('Warm-up', 1, '5 min', 'Walk or march, then practice squats, hip hinges, and the first weighted movements.'), exercise('Goblet squat to chair', 2, reps, 'Rest 90 seconds. Lightly touch a sturdy chair and stand.'), press, row, exercise('Dumbbell Romanian deadlift', 2, reps, 'Rest 90 seconds. Push hips back; keep weights close.'), exercise('Dead bug', 2, `${5 + n}/side`, 'Rest 45–60 seconds. Keep trunk steady and breathe.'), exercise('Easy walk & cool-down', 1, '7 min', 'Walk comfortably for 5 minutes, then ease down for 2.')] },
      { title: 'Cardio & Mobility', image: '/images/workout-stretch-mobility-v2.png', duration: '30–35 min', guidance: 'Keep conversation possible. Repeat an earlier duration if needed.', exercises: [exercise('Easy walk warm-up', 1, '5 min', 'Start at a comfortable pace.'), exercise('Steady walk', 1, `${[15, 17, 20, 20][week]} min`, 'Use a sustainable pace; start easier if needed.'), exercise('Easy walk cool-down', 1, '3 min', 'Gradually slow down.'), exercise('Mobility sequence', 1, '7 min', 'Cat-cow: 6 reps; side-lying upper-back rotation: 5/side; supported hip-flexor, calf and seated hamstring stretches: 20 seconds/side; relaxed breathing: 60 seconds. Allow time for transitions.')] },
      { title: 'Full Body Balance', image: '/images/workout-full-body-light-v2.png', duration: '30–40 min', guidance, exercises: [exercise('Warm-up', 1, '5 min', 'Walk or march, then practice supported split squats and light presses.'), exercise('Supported split squat', 2, `${6 + n}/side`, 'Start without weights. Rest 90 seconds after both sides.'), press, row, exercise('Glute bridge', 2, [10, 12, 15, 15][week], 'Bodyweight. Rest 60 seconds. Avoid arching the lower back.'), exercise('Standing dumbbell shoulder press', 2, 8 + n, 'Use light weights. Rest 90 seconds. Avoid leaning back.'), exercise('Easy walk', 1, '3–5 min', 'Finish at a comfortable pace.')] },
    ];
    workouts.forEach((workout, i) => sessions.push({ ...workout, key: `w${week + 1}-${i + 1}`, week: week + 1, date: addDays(start, week * 7 + TRAINING_DAYS.indexOf(days[i]) - firstDay) }));
  }
  return { user_id: profile.id, template_key: 'foundations', template_version: 1, status: 'active', starts_on: start, preferences: p, prescription: { title: 'Momentum Foundations', ends_on: addDays(start, 27), sessions } };
}
