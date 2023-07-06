import { defineConfig } from 'astro/config';
import activeHandout from "@insperedu/active-handout";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  integrations: [activeHandout({
    title: "Active Handout Docs",
    description: "A documentation site with examples using Active Handout",
  })]
});