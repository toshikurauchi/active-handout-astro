import type { APIRoute } from "astro";
import { loadExerciseOrError } from "./utils";

export const POST: APIRoute = async ({ request }) => {
  const { data, exercise, response } = await loadExerciseOrError<{studentAnswer: string, totalTests: number, passingTests: number, exception: string}>(await request.json());
  if (response) {
    return response;
  }

  let percentComplete = 0;
  const { studentAnswer, totalTests, passingTests, exception } = data;
  if (exercise.data.hasTests) {
    if (exception || !totalTests) {
      percentComplete = 0;
    } else {
      percentComplete = (passingTests / totalTests) * 100;
    }
  } else {
    percentComplete = studentAnswer === exercise.data.expected ? 100 : 0;
  }

  return new Response(
    JSON.stringify({
      percentComplete,
      data,
    }),
    { status: 200 }
  );
};
