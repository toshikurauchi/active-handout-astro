import config from "virtual:active-handout/user-config";
import { createExercise } from "../../db/exercise/queries";
import { getUserSubmissions } from "../../db/user-submissions/queries";
import { Exercise } from "../../db/exercise/model";
import { handoutIdFromPath } from "../../db/handout/collection";

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
    const exercise = cache.exercises?.find(
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

export function getLatestSubmissionFromCache(
  cache: App.Locals,
  handoutPath: string,
  slug: string,
  userId: string
) {
  if (config.auth && config.telemetry) {
    const pageId = handoutIdFromPath(handoutPath);
    const userSubmissions = cache.submissions?.find(
      (submission) =>
        submission.exerciseSlug === slug &&
        submission.userId === userId &&
        submission.pageId === pageId
    );
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
  const userSubmissions = await getUserSubmissions(handoutPath, slug, userId);
  return userSubmissions?.latestTelemetryData || null;
}
