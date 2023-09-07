export const CLEAR_OPTIONS_EVENT = "clearoptions";
export const OPTION_SELECTED_EVENT = "optionselected";

export function dispatchClearOptionsEvent(element: Element, index: number) {
  const event = new CustomEvent(CLEAR_OPTIONS_EVENT, {
    detail: { index },
  });
  element.dispatchEvent(event);
}

export function dispatchOptionSelected(element: Element, index: number) {
  const event = new CustomEvent(OPTION_SELECTED_EVENT, {
    detail: { index },
  });
  element.dispatchEvent(event);
}
