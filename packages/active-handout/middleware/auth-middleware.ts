import config from "virtual:active-handout/user-config";
import { defineMiddleware } from "astro/middleware";
import { getUserFromCookie } from "../utils/server-auth";

const authMiddleware = defineMiddleware(async ({ locals, cookies }, next) => {
  if (config.auth) {
    locals.user = await getUserFromCookie(cookies.get("session")?.value);
  }

  const response = await next();

  return response;
});

export default authMiddleware;
