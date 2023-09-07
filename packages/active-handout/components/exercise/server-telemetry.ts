import config from "virtual:active-handout/user-config";
import { createExercise } from "../../db/exercise/queries";
import { getTelemetrySummary } from "../../db/telemetry-summary/queries";
import { Exercise } from "../../db/exercise/model";
import { handoutIdFromPath } from "../../firebase/schema";
import type { ExerciseContainerProps } from "./props";

export async function setupExercise(
  props: ExerciseContainerProps,
  cache: App.Locals,
  handoutPath: string,
  exerciseType: string,
  extraTags: string[]
) {
  if (!props.tags) {
    props.tags = [];
  }
  const { slug, tags } = props;
  tags.push(...extraTags);

  const exercise = await createOrGetExerciseFromCache(
    cache,
    handoutPath,
    slug,
    exerciseType,
    tags,
    {}
  );
  const exerciseNumber = getAutoIncrementedExerciseNumber(cache, exercise);

  let latestSubmission;
  if (config.auth && config.telemetry) {
    const handout = cache.handout;
    const user = cache.user;

    if (!handout) {
      throw new Error("No handout found for exercise " + slug);
    }
    if (!user) {
      throw new Error("No user found");
    }
    latestSubmission = getLatestSubmissionFromCache(cache, slug);
  }

  return [exerciseNumber, latestSubmission, slug] as const;
}

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
