import test from 'node:test';
import assert from 'node:assert/strict';
import { preferenceFields, preferencesFromProfile, toggleEquipment } from './preferences.js';
import { buildPersonalizedPlan } from './personalization.js';

test('new and legacy profiles have usable defaults without losing focus', () => {
  assert.deepEqual(preferencesFromProfile(null).days, ['Mon', 'Wed', 'Fri']);
  assert.deepEqual(preferencesFromProfile({ workout_frequency: '1_2_days', personalized_plan: { focus_areas: ['Glutes'] } }).focus, ['Glutes']);
  assert.deepEqual(preferencesFromProfile({ workout_frequency: '1_2_days' }).days, ['Mon', 'Thu']);
});
test('preferences round-trip exact days, equipment, focus, and time', () => {
  const answers = { ...preferencesFromProfile(), days: ['Sun', 'Wed'], focus: ['Back', 'Abs'], equipment: [], time: '20–30' };
  assert.deepEqual(preferencesFromProfile(preferenceFields(answers)), answers);
  const plan = buildPersonalizedPlan(answers);
  assert.equal(plan.days_per_week, 2);
  assert.deepEqual(plan.weekly_schedule.map(session => session.weekday), ['Sun', 'Wed']);
  assert.ok(plan.weekly_schedule.every(session => session.duration_minutes === 25));
});
test('empty and invalid days cannot be saved', () => {
  assert.throws(() => preferenceFields({ ...preferencesFromProfile(), days: [] }));
  assert.throws(() => preferenceFields({ ...preferencesFromProfile(), days: ['Invalid'] }));
});
test('explicitly cleared focus does not resurrect legacy selections', () => {
  assert.deepEqual(preferencesFromProfile({ focus_areas: [], personalized_plan: { focus_areas: ['Arms'] } }).focus, []);
});
test('gym shortcut saves explicit equipment and respects deselections', () => {
  const equipment = toggleEquipment([], 'Full gym access');
  assert.ok(equipment.includes('Dumbbells'));
  const customized = toggleEquipment(equipment, 'Cable Machine');
  assert.ok(!customized.includes('Cable Machine'));
  assert.ok(customized.includes('Full gym access'));
  const profile = preferenceFields({ ...preferencesFromProfile(), equipment: customized });
  assert.deepEqual(preferencesFromProfile(profile).equipment, customized);
  assert.deepEqual(preferencesFromProfile({ available_equipment: ['Gym Membership'] }).equipment, ['Full gym access']);
});
