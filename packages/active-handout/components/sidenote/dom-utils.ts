export function getRemainingSpaceRight() {
  const documentRight = getRight(document.body);
  const mainContent = document.querySelector(".main-content");
  const mainContentRight = mainContent ? getRight(mainContent) : documentRight;
  return documentRight - mainContentRight;
}

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function updateBodyProperty(name: string, value: string) {
  document.body.style.setProperty(name, value);
  const prevValue = getBodyProperty(name);
  if (prevValue !== value) {
    setBodyProperty(name, value);
  }
}

export function setBodyProperty(name: string, value: string) {
  document.body.style.setProperty(name, value);
}

export function getBodyProperty(name: string) {
  return getComputedStyle(document.body).getPropertyValue(name);
}

export function getTop(element: Element) {
  /**
   * Returns the distance from the top of the screen to the top of the element.
   */
  return element.getBoundingClientRect().top + window.scrollY;
}

export function getBottom(element: Element) {
  /**
   * Returns the distance from the top of the screen to the bottom of the element.
   */
  return element.getBoundingClientRect().bottom + window.scrollY;
}

export function getLeft(element: Element) {
  /**
   * Returns the distance from the left of the screen to the left of the element.
   */
  return element.getBoundingClientRect().left + window.scrollX;
}

export function getRight(element: Element) {
  /**
   * Returns the distance from the left of the screen to the right of the element.
   */
  return element.getBoundingClientRect().right + window.scrollX;
}

export function getWidth(element: Element) {
  return element.getBoundingClientRect().width;
}

export function getHeight(element: Element) {
  return element.getBoundingClientRect().height;
}
