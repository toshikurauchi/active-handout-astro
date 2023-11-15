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
      "msg.answer": z.string().describe("Text for the word “Answer”"),
      "msg.or": z.string().describe("Text for the word “or”"),

      "msg.exercise-edit": z
        .string()
        .describe("Text for the button that edits the exercise answer"),

      "msg.exercise-clear": z
        .string()
        .describe("Text for the button that clears exercise answer"),

      "msg.all-exercises-clear": z
        .string()
        .describe("Text for the button that clears all answers"),

      "msg.all-exercises-cleared": z
        .string()
        .describe(
          "Text for the message to show when the user clears all answers"
        ),

      "msg.clear-selection": z
        .string()
        .describe("Text for the button that clears the selection"),

      "msg.submit": z.string().describe("Text for the submit button"),

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

      "auth.signout": z.string().describe("Text shown on the signout button"),

      "field.required": z
        .string()
        .describe("Error message shown when a required field is empty"),

      "exercise.title": z.string().describe("Title of an exercise"),

      "exercise.mark-done": z
        .string()
        .describe("Text shown on the button to mark an exercise as done"),

      "profile.edit": z
        .string()
        .describe("Text shown on the button to edit the profile"),

      "profile.displayName": z
        .string()
        .describe("Label for display name field on the profile page"),

      "profile.add-picture": z
        .string()
        .describe("Text shown on the button to add the profile picture"),

      "profile.change-picture": z
        .string()
        .describe("Text shown on the button to change the profile picture"),

      "profile.unsaved-changes": z
        .string()
        .describe("Text shown when user has not saved the changes"),

      "parsons.drag-from-here": z
        .string()
        .describe(
          "Label for the box containing the available lines for a Parsons exercise"
        ),

      "parsons.drop-here": z
        .string()
        .describe(
          "Label for the box containing the lines that the user has selected for a Parsons exercise"
        ),

      "parsons.sort-lines": z
        .string()
        .describe(
          "Label for the box that contains the lines in a Parsons exercise when there is a single box"
        ),

      "parsons.passing-tests": z
        .string()
        .describe(
          "String shown on answer box with the number of passing tests (must have the following placeholders: {passingTests}, {totalTests}, {percentComplete})"
        ),

      "parsons.exception": z
        .string()
        .describe("String shown on answer box when an exception occurs"),

      "ai.error": z
        .string()
        .describe(
          "Error message shown when an error occurs in the AI text exercise"
        ),

      "markdown-input.toggle-preview": z
        .string()
        .describe("Text shown on the button to toggle the Markdown preview"),

      "markdown-input.has-errors": z
        .string()
        .describe("Text shown when the Markdown preview has errors"),
    })
    .partial();
}
