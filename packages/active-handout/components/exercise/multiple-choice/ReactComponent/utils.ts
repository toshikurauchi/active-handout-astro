export function getOptionPointsFromLocalStorage(
  registryKey: string,
  selectedOption: number
) {
  const options = localStorage.getItem(registryKey);
  if (options) {
    const parsedOptions = JSON.parse(options);
    const optionData = parsedOptions?.[selectedOption];
    if (optionData) {
      return optionData.points;
    }
  }
  return -1;
}
