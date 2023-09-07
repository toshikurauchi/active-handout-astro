export function getContainer(element: Element): Element {
  const container = element.closest(".multiple-choice-exercise-container");
  if (!container)
    throw new Error(
      "Could not find multiple choice exercise container. Make sure you have wrapped your options in a <MultipleChoice> component."
    );
  return container;
}
