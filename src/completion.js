export function allExercisesComplete(exercises, checks) {
  return exercises.length > 0 && exercises.every((_, index) => checks.includes(index));
}
export function shouldCelebrateCompletion(exercises, checks, record) {
  return allExercisesComplete(exercises, checks) && !record?.celebratedAt;
}
