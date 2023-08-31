import config from "virtual:active-handout/user-config";
import { sequence } from "astro/middleware";
import exerciseMiddleware from "./exercise-middleware";
import authMiddleware from "./auth-middleware";

const middlewares = [];
if (config.auth) {
  middlewares.push(authMiddleware);

  if (config.telemetry) {
    middlewares.push(exerciseMiddleware);
  }
}

const activeHandoutMiddleware = sequence(...middlewares);

export default activeHandoutMiddleware;
