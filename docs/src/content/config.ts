import { defineCollection } from "astro:content";
import { HandoutSchema } from "@toshikurauchi/active-handout/types";

const handoutCollection = defineCollection({
  schema: HandoutSchema,
});
export const collections = {
  handouts: handoutCollection,
};
