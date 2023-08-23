import { z } from "astro/zod";

export function i18nSchema() {
  return activeHandoutI18nSchema();
}

export function builtinI18nSchema() {
  return activeHandoutI18nSchema().required().strict();
}

function activeHandoutI18nSchema() {
  return z
    .object({
      "skipLink.label": z
        .string()
        .describe(
          "Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page."
        ),

      "404.text": z
        .string()
        .describe("Text shown on Active Handout’s default 404 page"),

      "404.title": z
        .string()
        .describe("Title shown on Active Handout’s default 404 page"),

      "signin.title": z.string().describe("Title shown on the sign-in page"),

      "signin.no-account": z
        .string()
        .describe(
          "Text shown on the sign-in page when the user has no account"
        ),

      "signin.create-account": z
        .string()
        .describe("Text shown on create account button on the sign-in page"),

      "signin.error": z.string().describe("Error message on the sign-in page"),
    })
    .partial();
}
