export function buildId(baseId: string) {
  return `sidenote-${baseId}`;
}

export function buildAnchorId(baseId: string) {
  return `sidenote-anchor-${baseId}`;
}

const BASE_Z_INDEX = 9999999;

export function updateZIndex(sidenote: HTMLElement | null, open: boolean) {
  if (!sidenote) return;

  let zIndex = BASE_Z_INDEX;
  if (open) {
    const allSidenotes = document.querySelectorAll(".sidenote");
    const maxZIndex = Math.max(
      ...Array.from(allSidenotes).map(
        (sidenote: Element) =>
          parseFloat(
            getComputedStyle(sidenote).getPropertyValue("--sidenote-z-index")
          ) || BASE_Z_INDEX
      )
    );
    zIndex = maxZIndex + 1;
  }
  sidenote.style.setProperty("--sidenote-z-index", `${zIndex}`);
}
