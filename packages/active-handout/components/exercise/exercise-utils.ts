import config from "virtual:active-handout/user-config";

interface TelemetryData {
  meta: {
    pageId: string;
    slug: string;
    type: string;
    percentComplete: number;
  };
}

let postTelemetry: (
  pageId: string,
  slug: string,
  type: string,
  percentComplete: number,
  data: any
) => void;
let fetchTelemetry: (pageId: string, slug: string) => TelemetryData | null;
let clearTelemetry: (pageId: string, slug?: string) => void;

const useTelemetry = !!(config.telemetry && config.auth);
if (useTelemetry) {
  // TODO
} else {
  postTelemetry = saveTelemetryToLocalStorage;
  fetchTelemetry = getTelemetryFromLocalStorage;
  clearTelemetry = clearTelemetryFromLocalStorage;
}
export { postTelemetry, fetchTelemetry, clearTelemetry };

export function getAutoIncrementedExerciseNumber(
  astroParams: App.Locals & { exerciseSlugs?: string },
  slug: string
) {
  if (!slug) {
    throw new Error("Exercise slug cannot be empty");
  }

  const exerciseSlugs = JSON.parse(
    astroParams.exerciseSlugs || "[]"
  ) as string[];
  const slugIndex = exerciseSlugs.indexOf(slug);
  if (slugIndex >= 0) {
    return slugIndex + 1;
  }

  exerciseSlugs.push(slug);
  astroParams.exerciseSlugs = JSON.stringify(exerciseSlugs);

  return exerciseSlugs.length;
}

function saveTelemetryToLocalStorage(
  pageId: string,
  slug: string,
  type: string,
  percentComplete: number,
  data: any
) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  if (!type) throw new Error("type is required");
  if (!percentComplete) throw new Error("percentComplete is required");
  if (percentComplete < 0 || percentComplete > 100)
    throw new Error("percentComplete must be between 0 and 100");

  data.meta = {
    pageId,
    slug,
    type,
    percentComplete,
    timestamp: Date.now(),
  };

  localStorage.setItem(buildKey(pageId, slug), JSON.stringify(data));
}

function getTelemetryFromLocalStorage(pageId: string, slug: string) {
  const serializedData = localStorage.getItem(buildKey(pageId, slug));
  return serializedData ? (JSON.parse(serializedData) as TelemetryData) : null;
}

function clearTelemetryFromLocalStorage(pageId: string, slug?: string) {
  if (slug) {
    localStorage.removeItem(buildKey(pageId, slug));
    return;
  }

  Object.keys(localStorage)
    .filter((key) => key.startsWith(`active-handout:telemetry:${pageId}:`))
    .forEach((key) => localStorage.removeItem(key));
}

export function buildKey(pageId: string, slug: string) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  return `active-handout:telemetry:${pageId}:${slug}`;
}
