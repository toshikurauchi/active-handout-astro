import { defineCollection, z } from 'astro:content';
const activeHandoutCollection = defineCollection({
  schema: z.object({
    title: z.string({description: "Page title"}),
    subtitle: z.string({description: "Page subtitle"}).optional(),
    navigation: z.object({
      title: z.string({description: "Navigation title (set this to replace the title in the navigation menu)"}).optional(),
      order: z.number({description: "Order in the navigation menu (lower numbers come first)"}).default(99999),
      show: z.boolean({description: "Show in the navigation menu"}).default(true),
    }).optional(),
  }),
});
export const collections = {
  'active-handout': activeHandoutCollection,
};