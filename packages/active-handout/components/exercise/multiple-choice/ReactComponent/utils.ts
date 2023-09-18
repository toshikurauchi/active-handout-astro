export function getOptionPointsFromLocalStorage(
  registryKey: string,
  selectedOption: number | null
) {
  const exerciseDataStr = localStorage.getItem(registryKey);
  if (exerciseDataStr && selectedOption !== null) {
    const exerciseData = JSON.parse(exerciseDataStr);
    const optionData = exerciseData?.options?.[selectedOption];
    if (optionData) {
      return optionData.points;
    }
  }
  return -1;
}
