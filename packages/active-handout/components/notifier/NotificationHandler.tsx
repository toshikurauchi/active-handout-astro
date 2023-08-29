import React, { useEffect } from "react";
import toast, { ToastPosition, Toaster } from "react-hot-toast";
import type { NotifyToastEvent } from "./custom-events";

export default function NotificationHandler() {
  useEffect(() => {
    document.addEventListener("NotifyToast", (event: NotifyToastEvent) => {
      const { message, duration, position } = event.detail;
      const options: {
        duration?: number;
        position?: ToastPosition;
      } = {};
      if (duration) {
        options["duration"] = duration;
      }
      options["position"] = position || "bottom-center";

      toast(message, options);
    });
  }, []);

  return <Toaster />;
}
