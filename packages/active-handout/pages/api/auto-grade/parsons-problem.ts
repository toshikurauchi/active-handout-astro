import type { APIRoute } from "astro";
import { getExercise } from "../../../db/exercise/queries";

export const GET: APIRoute = async ({ url }) => {
  const handoutPath = url.searchParams.get("handoutPath")?.toString();
  const exerciseSlug = url.searchParams.get("exerciseSlug")?.toString();
  const data = JSON.parse(url.searchParams.get("data")?.toString() || "{}");

  if (!handoutPath || !exerciseSlug) {
    return new Response("Missing form data", { status: 400 });
  }

  const exercise = await getExercise(exerciseSlug, handoutPath);
  if (!exercise) {
    return new Response("Exercise not found", { status: 404 });
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
  console.log("percentComplete", percentComplete, data);

  return new Response(
    JSON.stringify({
      percentComplete,
      data,
    }),
    { status: 200 }
  );
};
