import type { APIRoute } from "astro";
import { getLatestSubmissionFromDB } from "../../../components/exercise/server-telemetry";

export const GET: APIRoute = async ({ url, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("No user found", { status: 401 });
  }

  const handoutPath = url.searchParams.get("handoutPath")?.toString();
  const exerciseSlug = url.searchParams.get("exerciseSlug")?.toString();

  if (!handoutPath || !exerciseSlug) {
    return new Response("Missing form data", { status: 400 });
  }
  const telemetryData = await getLatestSubmissionFromDB(
    handoutPath,
    exerciseSlug,
    user.uid
  );

  return new Response(JSON.stringify(telemetryData), { status: 200 });
};
