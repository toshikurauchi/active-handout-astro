export type ToggleSidenoteEvent = CustomEvent<{
  sidenoteId: string;
  open: boolean;
}>;

export function dispatchToggleSidenote(sidenoteId: string, open: boolean) {
  const event = new CustomEvent("ToggleSidenote", {
    detail: {
      sidenoteId,
      open,
    },
  });
  document.dispatchEvent(event);
}
