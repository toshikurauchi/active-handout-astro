import type { APIRoute } from "astro";
import {
  deleteAllLatestUserSubmission,
  deleteLatestUserSubmission,
} from "../../../db/user-submissions/queries";

export const DELETE: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("No user found", { status: 401 });
  }

  /* Get form data */
  const formData = await request.formData();

  const handoutPath = formData.get("handoutPath")?.toString();
  const exerciseSlug = formData.get("exerciseSlug")?.toString();

  if (!handoutPath) {
    return new Response("Missing form data", { status: 400 });
  }

  if (exerciseSlug) {
    await deleteLatestUserSubmission(handoutPath, exerciseSlug, user.uid);
  } else {
    await deleteAllLatestUserSubmission(handoutPath, user.uid);
  }

  return new Response("OK", { status: 200 });
};
