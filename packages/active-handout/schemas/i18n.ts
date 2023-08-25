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
      "msg.or": z.string().describe("Text for the word “or”"),

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

      "auth.signin-title": z
        .string()
        .describe("Title shown on the sign-in page"),

      "auth.no-account": z
        .string()
        .describe(
          "Text shown on the sign-in page when the user has no account"
        ),

      "auth.create-account": z
        .string()
        .describe("Text shown on create account button on the sign-in page"),

      "auth.signin-error": z
        .string()
        .describe("Error message on the sign-in page"),

      "auth.name-label": z.string().describe("Label for the name input"),

      "auth.email-label": z.string().describe("Label for the email input"),

      "auth.password-label": z
        .string()
        .describe("Label for the password input"),

      "auth.signin-submit": z
        .string()
        .describe("Label for the submit button on the sign-in page"),

      "auth.invalid-name": z
        .string()
        .describe("Error message shown when the name is invalid"),

      "auth.invalid-email": z
        .string()
        .describe("Error message shown when the email is invalid"),

      "auth.invalid-password": z
        .string()
        .describe("Error message shown when the password is invalid"),

      "auth.too-many-requests": z
        .string()
        .describe(
          "Error message shown when the user has made too many unsuccessful sign-in attempts"
        ),

      "auth.register-title": z
        .string()
        .describe("Title shown on the registration page"),

      "auth.has-account": z
        .string()
        .describe(
          "Text shown on the registration page when the user already has an account"
        ),

      "auth.signin": z
        .string()
        .describe(
          "Text shown on the link to the signin page on the registration page"
        ),

      "auth.signin-google": z
        .string()
        .describe("Text shown on the Google signin button"),

      "auth.signin-github": z
        .string()
        .describe("Text shown on the GitHub signin button"),

      "auth.register-submit": z
        .string()
        .describe("Label for the submit button on the registration page"),

      "field.required": z
        .string()
        .describe("Error message shown when a required field is empty"),
    })
    .partial();
}
