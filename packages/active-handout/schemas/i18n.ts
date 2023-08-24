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
      "field.required": z
        .string()
        .describe("Error message shown when a required field is empty"),

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

      "signin.email": z
        .string()
        .describe("Label for the email input on the sign-in page"),

      "signin.password": z
        .string()
        .describe("Label for the password input on the sign-in page"),

      "signin.submit": z
        .string()
        .describe("Label for the submit button on the sign-in page"),

      "signin.invalid-email": z
        .string()
        .describe("Error message shown when the email is invalid"),

      "signin.invalid-password": z
        .string()
        .describe("Error message shown when the password is invalid"),

      "signin.too-many-requests": z
        .string()
        .describe(
          "Error message shown when the user has made too many unsuccessful sign-in attempts"
        ),
    })
    .partial();
}
