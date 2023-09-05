import type { APIRoute } from "astro";
import { removeUserCookie } from "../../../utils/server-auth";

export const POST: APIRoute = async ({ redirect, cookies }) => {
  removeUserCookie(cookies);
  return redirect("/signin");
};
