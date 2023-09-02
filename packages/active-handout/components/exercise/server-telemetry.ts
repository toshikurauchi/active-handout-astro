import config from "virtual:active-handout/user-config";
import { createExercise } from "../../db/exercise/queries";
import { getTelemetrySummary } from "../../db/telemetry-summary/queries";
import { Exercise } from "../../db/exercise/model";
import { handoutIdFromPath } from "../../firebase/schema";

export async function createOrGetExerciseFromCache(
  cache: App.Locals,
  handoutPath: string,
  slug: string | undefined,
  type: string,
  tags: string[],
  data: any
) {
  if (!slug) {
    throw new Error("Exercise slug cannot be empty");
  }

  if (config.auth && config.telemetry) {
    const exercise = cache.handout?.exercises.find(
      (exercise) => exercise.slug === slug
    );
    if (exercise) {
      return exercise;
    } else {
      return await createExercise(slug, type, handoutPath, tags, data);
    }
  } else {
    const pageId = handoutIdFromPath(handoutPath);
    return new Exercise(slug, pageId, type, tags, data);
  }
}

export function getLatestSubmissionFromCache(cache: App.Locals, slug: string) {
  if (config.auth && config.telemetry) {
    const userSubmissions = cache.submissions?.[slug] || null;
    return userSubmissions?.latestTelemetryData || null;
  } else {
    return null;
  }
}

export async function getLatestSubmissionFromDB(
  handoutPath: string,
  slug: string,
  userId: string
) {
  const userSubmissions = await getTelemetrySummary(handoutPath, slug, userId);
  return userSubmissions?.latestTelemetryData || null;
}
