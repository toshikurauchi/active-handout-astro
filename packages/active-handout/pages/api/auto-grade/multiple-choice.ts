import type { APIRoute } from "astro";
import { getExercise } from "../../../db/exercise/queries";

export const GET: APIRoute = async ({ url, locals }) => {
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
