import config from "virtual:active-handout/user-config";
import {
  clearTelemetryFromLocalStorage,
  getTelemetryFromLocalStorage,
  saveTelemetryToLocalStorage,
} from "./local-telemetry";
import {
  clearTelemetryFromServer,
  getTelemetryDataFromServer,
  postTelemetryDataToServer,
} from "./client-telemetry";
import type { Exercise } from "../../db/exercise/model";
import type { TelemetryData } from "../../db/telemetry/model";

let postTelemetry: (
  handoutPath: string,
  slug: string,
  type: string,
  percentComplete: number,
  data: any
) => Promise<void>;
let fetchTelemetry: (
  handoutPath: string,
  slug: string
) => Promise<TelemetryData | null | undefined>;
let clearTelemetry: (handoutPath: string, slug?: string) => Promise<void>;

const useTelemetry = !!(config.telemetry && config.auth);
if (useTelemetry) {
  fetchTelemetry = getTelemetryDataFromServer;
  postTelemetry = postTelemetryDataToServer;
  clearTelemetry = clearTelemetryFromServer;
} else {
  postTelemetry = saveTelemetryToLocalStorage;
  fetchTelemetry = getTelemetryFromLocalStorage;
  clearTelemetry = clearTelemetryFromLocalStorage;
}
export { postTelemetry, fetchTelemetry, clearTelemetry };
