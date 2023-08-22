import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getAuth } from "firebase-admin/auth";

export const get: APIRoute = async ({ url, request, cookies, redirect }) => {
  const auth = getAuth(app);

  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  /* Verify id token */
  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }

  /* Create and set session cookie */
  const oneYear = 1000 * 60 * 60 * 24 * 5;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: oneYear,
  });

  cookies.set("session", sessionCookie, {
    path: "/",
  });

  const nextUrl = url.searchParams.get("next") || "/";
  return redirect(nextUrl);
};
