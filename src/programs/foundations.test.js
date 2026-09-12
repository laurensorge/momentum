import test from 'node:test';
import assert from 'node:assert/strict';
import { createFoundations, supportsFoundations, addDays } from './foundations.js';
const profile = { id: 'test-user', fitness_goal: 'general_fitness', fitness_level: 'beginner', training_days: ['Mon','Wed','Fri'], session_length: '30–40', available_equipment: ['Dumbbells'], focus_areas: [], preferred_activities: ['Walking'] };
test('creates twelve uniquely dated sessions and retains the selected preferences', () => {
  const plan = createFoundations(profile, '2026-09-12');
  assert.equal(plan.starts_on, '2026-09-14');
  assert.equal(plan.prescription.sessions.length, 12);
  assert.equal(new Set(plan.prescription.sessions.map(s => s.key)).size, 12);
  assert.equal(new Set(plan.prescription.sessions.map(s => s.date)).size, 12);
  assert.equal(plan.prescription.ends_on, '2026-10-11');
  assert.deepEqual(plan.preferences.days, ['Mon','Wed','Fri']);
  for (const s of plan.prescription.sessions) assert.ok([1,3,5].includes(new Date(`${s.date}T12:00:00`).getDay()));
});
test('week four repeats week three without forcing progression', () => {
  const sessions = createFoundations(profile, '2026-09-14').prescription.sessions;
  for (let i = 0; i < 3; i++) assert.deepEqual(sessions[6+i].exercises, sessions[9+i].exercises);
});
test('unsupported preferences do not receive an incompatible program', () => {
  for (const change of [{ fitness_level:'advanced' }, { focus_areas:['Glutes'] }, { available_equipment:[] }, { training_days:['Mon','Tue'] }, { training_days:['Sun','Wed','Sat'] }, { session_length:'20–30' }, { preferred_activities:['Swimming'] }]) assert.equal(supportsFoundations({ ...profile, ...change }), false);
});
test('local calendar arithmetic crosses DST and year boundaries', () => {
  assert.equal(addDays('2026-10-31', 2), '2026-11-02');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});
