import config from "virtual:active-handout/user-config";
import { createOrUpdateExercise } from "../../db/exercise/queries";
import { getTelemetrySummary } from "../../db/telemetry-summary/queries";
import { Exercise } from "../../db/exercise/model";
import { handoutIdFromPath } from "../../firebase/schema";
import type { ExerciseContainerProps } from "./props";
import { rehypeExtractAnswer } from "./answer/rehype-extract-answer";

export async function buildExerciseContainerProps<T>(
  baseHTML: string,
  props: ExerciseContainerProps,
  cache: App.Locals,
  handoutPath: string,
  exerciseType: string,
  extraTags: string[],
  getData: (baseHTML: string) => {
    data: any;
    extraProps: T;
    newHTML?: string;
  }
) {
  if (!props.tags) {
    props.tags = [];
  }
  const { slug, tags } = props;
  tags.push(...extraTags);

  const [answerHTML, htmlWithoutAnswer] = rehypeExtractAnswer(baseHTML);
  const { data, extraProps, newHTML } = getData(htmlWithoutAnswer);

  const exercise = await createOrGetExerciseFromCache(
    cache,
    handoutPath,
    slug,
    exerciseType,
    tags,
    data
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

  const registryKey = `exercise-registry/${exerciseType}/${handoutPath}/${slug}`;

  return {
    exerciseData: !config.auth || !config.telemetry ? data : undefined,
    baseHTML: typeof newHTML === "undefined" ? htmlWithoutAnswer : newHTML,
    answerHTML,
    registryKey,
    handoutPath,
    exerciseType,
    slug,
    exerciseNumber,
    latestSubmission,
    ...extraProps,
  };
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
    if (
      !exercise ||
      exercise.type !== type ||
      exercise.tags !== tags ||
      exercise.data !== data
    ) {
      return await createOrUpdateExercise(slug, type, handoutPath, tags, data);
    } else {
      return exercise;
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
    const previousExercise = exercises[slugIndex];
    if (
      previousExercise?.type !== exercise.type ||
      previousExercise?.tags !== exercise.tags ||
      previousExercise?.data !== exercise.data
    ) {
      throw new Error(
        `Exercise ${exercise.slug} already exists with different type, tags or data`
      );
    }
    return slugIndex + 1;
  }

  exercises.push(exercise);
  astroLocals.exercises = exercises;

  return exercises.length;
}
