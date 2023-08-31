import { sequence } from "astro/middleware";
import activeHandoutMiddleware from "@toshikurauchi/active-handout/middleware/index";

export const onRequest = sequence(activeHandoutMiddleware);
