import type { APIRoute } from "astro";
import { updateTelemetrySummary } from "../../../db/telemetry-summary/queries";
import { getExercise } from "../../../db/exercise/queries";

export const POST: APIRoute = async ({ request, locals, url }) => {
  const user = locals.user;
  if (!user) {
    return new Response("No user found", { status: 401 });
  }

  /* Get form data */
  const formData = await request.formData();

  const handoutPath = formData.get("handoutPath")?.toString();
  const exerciseSlug = formData.get("exerciseSlug")?.toString();
  let percentComplete = parseFloat(
    formData.get("percentComplete")?.toString() || "0"
  );
  let data = JSON.parse(formData.get("data")?.toString() || "{}");

  if (!handoutPath || !exerciseSlug) {
    return new Response("Missing form data", { status: 400 });
  }

  const exercise = await getExercise(exerciseSlug, handoutPath);
  if (!exercise) {
    return new Response("Exercise not found", { status: 404 });
  }

  /* Auto grade */
  const result = await fetch(
    new URL(
      `/api/auto-grade/${exercise.type}`,
      url.origin
    ).href,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        handoutPath,
        exerciseSlug,
        data,
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      if (e instanceof SyntaxError) {
        // For some reason the response is not 404, but the body is not JSON
        return null;
      }
      console.log(e);
      return null;
    });
  if (result) {
    percentComplete = result.percentComplete;
    data = result.data;
  }

  /* Save on DB */
  await updateTelemetrySummary(
    handoutPath,
    exerciseSlug,
    user.uid,
    percentComplete,
    data
  );

  return new Response("OK", { status: 200 });
};
