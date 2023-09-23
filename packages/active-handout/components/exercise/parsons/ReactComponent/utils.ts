export function getAnswerPointsFromLocalStorage(
  registryKey: string,
  studentAnswer: string
) {
  const exerciseDataStr = localStorage.getItem(registryKey);
  if (exerciseDataStr) {
    const exerciseData = JSON.parse(exerciseDataStr);
    const expectedAnswer = exerciseData?.expected;
    if (studentAnswer === expectedAnswer) {
      return 100;
    }
    return 0;
  }
  return -1;
}
