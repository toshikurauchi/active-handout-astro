export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotifyToastEvent = CustomEvent<{
  message: string;
  duration?: number | undefined;
  position?: ToastPosition | undefined;
}>;

export function dispatchNotification(
  message: string,
  duration?: number | undefined,
  position?: ToastPosition | undefined
) {
  const event = new CustomEvent("NotifyToast", {
    detail: {
      message,
      duration,
      position,
    },
  });
  document.dispatchEvent(event);
}
