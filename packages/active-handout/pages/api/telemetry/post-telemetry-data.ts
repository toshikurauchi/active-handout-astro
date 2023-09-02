import type { APIRoute } from "astro";
import { updateTelemetrySummary } from "../../../db/telemetry-summary/queries";

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("No user found", { status: 401 });
  }

  /* Get form data */
  const formData = await request.formData();

  const handoutPath = formData.get("handoutPath")?.toString();
  const exerciseSlug = formData.get("exerciseSlug")?.toString();
  const percentComplete = parseFloat(
    formData.get("percentComplete")?.toString() || "0"
  );
  const data = JSON.parse(formData.get("data")?.toString() || "{}");

  if (!handoutPath || !exerciseSlug) {
    return new Response("Missing form data", { status: 400 });
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
