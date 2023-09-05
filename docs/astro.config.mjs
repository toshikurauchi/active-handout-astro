import { defineConfig } from "astro/config";
import activeHandout from "@toshikurauchi/active-handout";

// https://astro.build/config
export default defineConfig({
  site: "https://toshikurauchi.github.io",
  // Had to do this after upgrading to Astro 3.0: https://github.com/withastro/astro/issues/8352
  base: import.meta.env.DEV ? "" : "/active-handout-astro/",
  integrations: [
    activeHandout({
      title: "Active Handout Docs",
      description: "A documentation site with examples using Active Handout",
    }),
  ],
});
