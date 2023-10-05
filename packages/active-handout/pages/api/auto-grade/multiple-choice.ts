import type { APIRoute } from "astro";
import { loadExerciseOrError } from "./utils";

export const GET: APIRoute = async ({ url }) => {
  const { data, exercise, response } = await loadExerciseOrError(url);
  if (response) {
    return response;
  }

  let percentComplete = 0;
  const selectedOption = data.option;
  if (typeof selectedOption !== "undefined" && exercise.data.options) {
    percentComplete = exercise.data?.options?.[selectedOption]?.points || 0;
  }

  return new Response(
    JSON.stringify({
      percentComplete,
      data,
    }),
    { status: 200 }
  );
};
