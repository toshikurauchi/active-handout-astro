import type { ToastPosition } from "react-hot-toast";

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
