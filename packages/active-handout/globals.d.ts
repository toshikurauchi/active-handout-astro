import "astro/client";

import type { NotifyToastEvent } from "./components/notifier/custom-events";
import type { ClearTelemetryEvent } from "./components/exercise/telemetry/custom-events";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { Handout as DBHandout } from "./db/handout/model";
import type { Exercise as DBExercise } from "./db/exercise/model";
import type { UserSubmissions as DBUserSubmissions } from "./db/user-submissions/model";

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

  namespace App {
    interface Locals {
      handout?: DBHandout;
      exercises?: DBExercise[];
      submissions?: DBUserSubmissions[];
      user?: DecodedIdToken | null;
    }
  }
}
