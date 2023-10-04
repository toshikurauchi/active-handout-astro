import { z } from "astro/zod";

export function handoutSchema() {
  return z.object({
    title: z.string({ description: "Page title" }),
    subtitle: z.string({ description: "Page subtitle" }).optional(),

    template: z.enum(["handout", "splash"]).default("handout"),

    navigation: z
      .object({
        title: z
          .string({
            description:
              "Navigation title (set this to replace the title in the navigation menu)",
          })
          .optional(),
        order: z
          .number({
            description:
              "Order in the navigation menu (lower numbers come first)",
          })
          .default(99999),
        show: z
          .boolean({ description: "Show in the navigation menu" })
          .default(true),
      })
      .optional(),

    requireLogin: z
      .boolean({
        description:
          "Require login to view this page (default value is taken from project settings)",
      })
      .optional(),

    usesPythonRuntime: z
      .boolean({
        description:
          "Uses Python in the browser, with PyScript (enable this to run Python tests for Parsons Problems)",
      })
      .optional(),
  });
}

export const HandoutSchema = handoutSchema();

export type Handout = z.infer<typeof HandoutSchema>;
