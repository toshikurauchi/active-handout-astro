import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getAuth } from "firebase-admin/auth";
import { extractUserFromRequest } from "./utils";

export const get: APIRoute = async ({ url, request, cookies, redirect }) => {
  const auth = getAuth(app);

  const [idToken, decodedToken, msg] = await extractUserFromRequest(request);
  if (!idToken || !decodedToken) {
    return new Response(msg, { status: 401 });
  }

  /* Create and set session cookie */
  const fiveDays = 1000 * 60 * 60 * 24 * 5;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  });

  cookies.set("session", sessionCookie, {
    path: "/",
  });

  const nextUrl = url.searchParams.get("next") || "/";
  return redirect(nextUrl);
};
