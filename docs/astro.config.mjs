import { defineConfig } from "astro/config";
import activeHandout from "@toshikurauchi/active-handout";

// https://astro.build/config
export default defineConfig({
  site: "https://toshikurauchi.github.io",
  base: "/active-handout-astro",
  experimental: {
    assets: true,
  },
  integrations: [
    activeHandout({
      title: "Active Handout Docs",
      description: "A documentation site with examples using Active Handout",
    }),
  ],
});
