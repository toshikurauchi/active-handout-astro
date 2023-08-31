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

export function getAutoIncrementedExerciseNumber(
  astroLocals: App.Locals,
  exercise: Exercise
) {
  const exercises = astroLocals.exercises || [];
  const exerciseSlugs = exercises.map((exercise: Exercise) => exercise.slug);
  const slugIndex = exerciseSlugs.indexOf(exercise.slug);
  if (slugIndex >= 0) {
    return slugIndex + 1;
  }

  exercises.push(exercise);
  astroLocals.exercises = exercises;

  return exercises.length;
}
