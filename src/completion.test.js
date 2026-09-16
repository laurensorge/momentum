import test from 'node:test';
import assert from 'node:assert/strict';
import { allExercisesComplete, shouldCelebrateCompletion } from './completion.js';
test('uses actual exercise counts including twelve-exercise workouts', () => {
  for (const count of [1, 7, 12, 20]) {
    const exercises = Array.from({ length: count }, () => ({}));
    const checks = Array.from({ length: count }, (_, i) => i);
    assert.equal(allExercisesComplete(exercises, checks.slice(1)), false);
    assert.equal(shouldCelebrateCompletion(exercises, checks), true);
  }
});
test('empty workouts, duplicate indexes and unrelated indexes cannot complete', () => {
  assert.equal(allExercisesComplete([], []), false);
  assert.equal(allExercisesComplete([{}, {}], [0, 0, 12]), false);
});
test('saved celebration marker prevents repeats after undo and rechecking', () => {
  assert.equal(shouldCelebrateCompletion([{}], [0], { celebratedAt: '2026-09-16' }), false);
  assert.equal(shouldCelebrateCompletion([{}], [0], undefined), true);
});
