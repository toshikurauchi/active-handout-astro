import { getExercise } from "../../../db/exercise/queries";

export async function loadExerciseOrError(url: URL) {
  const handoutPath = url.searchParams.get("handoutPath")?.toString();
  const exerciseSlug = url.searchParams.get("exerciseSlug")?.toString();
  let data;
  try {
    data = JSON.parse(url.searchParams.get("data")?.toString() || "{}");
  } catch (e) {
    data = {};
  }

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
