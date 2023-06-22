import { defineCollection, z } from 'astro:content';
const activeHandoutCollection = defineCollection({
  schema: z.object({
    title: z.string().optional(),
  }),
});
export const collections = {
  'active-handout': activeHandoutCollection,
};