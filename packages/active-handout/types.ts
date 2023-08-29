export type { ActiveHandoutConfig } from "./utils/user-config";
export { HandoutSchema } from "./schema";

import type { NotifyToastEvent } from "./components/notifier/custom-events";
import type { ClearTelemetryEvent } from "./components/exercise/telemetry/custom-events";

interface CustomEventMap {
  ClearTelemetry: ClearTelemetryEvent;
  NotifyToast: NotifyToastEvent;
}

declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}
