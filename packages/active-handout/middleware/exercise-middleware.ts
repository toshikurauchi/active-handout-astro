import config from "virtual:active-handout/user-config";
import { defineMiddleware } from "astro/middleware";
import {
  deleteHandout,
  getHandoutWithExercisesAndSubmissions,
} from "../db/handout/queries";

function isHandoutUrl(url: URL) {
  let pathname = url.pathname;

  if (pathname.startsWith("/")) pathname = pathname.slice(1);
  if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);

  if (pathname.startsWith("api/")) return false;
  if (["signin", "register", "404"].includes(pathname)) return false;
  return true;
}

const exerciseMiddleware = defineMiddleware(async ({ locals, url }, next) => {
  if (config.auth && config.telemetry && isHandoutUrl(url)) {
    if (locals.user) {
      const [handout, exercises, submissions] =
        await getHandoutWithExercisesAndSubmissions(
          url.pathname,
          locals.user.uid,
          true
        );
      locals.handout = handout;
      locals.exercises = exercises;
      locals.submissions = submissions;
    } else {
      console.log("No user found");
    }
  }

  const response = await next();

  if (response.status === 404) {
    deleteHandout(url.pathname);
  }

  return response;
});

export default exerciseMiddleware;
