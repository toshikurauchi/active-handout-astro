import { z } from 'astro/zod';

export function handoutSchema() {
  return z.object({
      title: z.string({description: "Page title"}),
      subtitle: z.string({description: "Page subtitle"}).optional(),

      template: z.enum(['handout', 'splash']).default('handout'),

      navigation: z.object({
        title: z.string({description: "Navigation title (set this to replace the title in the navigation menu)"}).optional(),
        order: z.number({description: "Order in the navigation menu (lower numbers come first)"}).default(99999),
        show: z.boolean({description: "Show in the navigation menu"}).default(true),
      }).optional(),
    });
}

export const HandoutSchema = handoutSchema();

export type Handout = z.infer<typeof HandoutSchema>;