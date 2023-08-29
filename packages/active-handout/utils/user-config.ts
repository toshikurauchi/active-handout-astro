import { z } from "astro/zod";

export const ActiveHandoutConfigSchema = z
  .object({
    title: z
      .string()
      .describe(
        "Title for your website. Will be used in metadata and as browser tab title."
      ),

    description: z
      .string()
      .optional()
      .describe(
        "Description metadata for your website. Can be used in page metadata."
      ),

    lang: z
      .string()
      .default("en")
      .describe(
        "Language for your website. Will be used to select the language of Active Handout components."
      ),

    auth: z
      .boolean()
      .default(false)
      .optional()
      .describe(
        "Enable authentication for your website. If true, we will enable SSR, so you need to DEPLOY ON VERCEL (which is the only adapter we have implemented so far)."
      ),

    useEmailAuth: z
      .boolean()
      .default(true)
      .describe("Use email authentication."),

    useGoogleAuth: z
      .boolean()
      .default(false)
      .describe("Use Google OAuth authentication."),

    useGitHubAuth: z
      .boolean()
      .default(false)
      .describe("Use GitHub OAuth authentication."),

    defaultRequireLogin: z
      .boolean()
      .default(true)
      .describe(
        "Default value for requireLogin in handouts. If auth is false, this value will be ignored."
      ),

    authPageImage: z
      .string()
      .optional()
      .describe(
        "Image to be used in the authentication page. If auth is false, this value will be ignored."
      ),

    telemetry: z
      .boolean()
      .default(false)
      .describe(
        "Enable telemetry for your website. If true and auth is true, we will enable the telemetry server, otherwise we will just use localStorage."
      ),
  })
  .refine((config) => {
    if (config.auth) {
      return (
        config.useEmailAuth || config.useGoogleAuth || config.useGitHubAuth
      );
    }
    return true;
  }, "If auth is true, you need to enable at least one authentication method.");

export type ActiveHandoutConfig = z.infer<typeof ActiveHandoutConfigSchema>;
export type ActiveHandoutUserConfig = z.input<typeof ActiveHandoutConfigSchema>;
