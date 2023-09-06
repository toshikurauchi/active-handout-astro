import {
  getBottom,
  getHeight,
  getLeft,
  getRemainingSpaceRight,
  getRight,
  getTop,
  getWidth,
  updateBodyProperty,
} from "./dom-utils";
import { buildAnchorId, buildId } from "./utils";

export function setupResizeObservers(
  baseId: string,
  extraHandler?: () => void
) {
  const bodyResizeObserver = new ResizeObserver(() => {
    updateMainContent();
    updateAnchor(baseId);

    if (extraHandler) {
      extraHandler();
    }
  });
  bodyResizeObserver.observe(document.body);

  const sidenoteId = buildId(baseId);
  const sidenote = document.getElementById(sidenoteId);
  if (sidenote) {
    const sidenoteResizeObserver = new ResizeObserver(() => {
      updateSidenote(sidenoteId, sidenote);
    });

    sidenoteResizeObserver.observe(sidenote);
  }
}

function updateMainContent() {
  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    updateBodyProperty("--main-content-left", `${getLeft(mainContent)}px`);
    updateBodyProperty("--main-content-right", `${getRight(mainContent)}px`);
    updateBodyProperty("--max-bottom", `${getBottom(mainContent)}px`);
    updateBodyProperty("--space-right", `${getRemainingSpaceRight()}px`);
    updateBodyProperty("--main-content-width", `${getWidth(mainContent)}px`);
  }
}

function updateAnchor(baseId: string) {
  const anchorId = buildAnchorId(baseId);
  const anchor = document.getElementById(anchorId);

  if (anchor) {
    const sidenoteId = buildId(baseId);
    updateBodyProperty(`--${sidenoteId}-top`, `${getTop(anchor)}px`);
    updateBodyProperty(`--${sidenoteId}-right`, `${getRight(anchor)}px`);
  }
}

function updateSidenote(sidenoteId: string, sidenote: Element) {
  const newHeight = getHeight(sidenote);
  if (newHeight > 0) {
    updateBodyProperty(`--${sidenoteId}-height`, `${newHeight}px`);
  }
}
