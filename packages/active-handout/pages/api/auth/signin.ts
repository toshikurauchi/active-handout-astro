import type { APIRoute } from "astro";
import { extractUserFromRequest } from "./utils";
import { setUserCookie } from "../../../utils/server-auth";

export const GET: APIRoute = async ({ url, request, cookies, redirect }) => {
  const [idToken, decodedToken, msg] = await extractUserFromRequest(request);
  if (!idToken || !decodedToken) {
    return new Response(msg, { status: 401 });
  }

  await setUserCookie(cookies, idToken);

  const nextUrl = url.searchParams.get("next") || "/";
  return redirect(nextUrl);
};
