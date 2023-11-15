import type { APIRoute } from "astro";
import { loadExerciseOrError } from "./utils";

export const POST: APIRoute = async ({ request }) => {
  const { data, exercise, response } = await loadExerciseOrError<{studentAnswer: string}>(await request.json());
  if (response) {
    return response;
  }

  const validation = exercise.data.validation;

  let percentComplete = 0;
  const { studentAnswer } = data;
  if (studentAnswer) {
    if (validation && !studentAnswer.match(new RegExp(validation))) {
      percentComplete = 0;
    } else {
      percentComplete = 100;
    }
  }

  return new Response(
    JSON.stringify({
      percentComplete,
      data,
    }),
    { status: 200 }
  );
};
