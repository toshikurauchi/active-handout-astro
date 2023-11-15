import { getExercise } from "../../../db/exercise/queries";

type Params = {
  handoutPath?: string;
  exerciseSlug?: string;
  data?: any;
}

export async function loadExerciseOrError<T>(params: Params) {
  const handoutPath = params.handoutPath?.toString();
  const exerciseSlug = params.exerciseSlug?.toString();
  const data: T = (params.data || {}) as T;

  if (!handoutPath || !exerciseSlug) {
    return {
      data,
      exercise: null,
      response: new Response("Missing form data", { status: 400 }),
    };
  }

  const exercise = await getExercise(exerciseSlug, handoutPath);
  if (!exercise) {
    return {
      data,
      exercise,
      response: new Response("Exercise not found", { status: 404 }),
    };
  }

  return {
    data,
    exercise,
    response: null,
  };
}
