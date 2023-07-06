import { z } from 'astro/zod';

export const ActiveHandoutConfigSchema = z.object({
    title: z
      .string()
      .describe(
        'Title for your website. Will be used in metadata and as browser tab title.'
      ),
  
    description: z
      .string()
      .optional()
      .describe(
        'Description metadata for your website. Can be used in page metadata.'
      ),

    lang: z
      .string()
      .default("en")
      .describe(
        'Language for your website. Will be used to select the language of Active Handout components.'
      )
  });
  
  export type ActiveHandoutConfig = z.infer<typeof ActiveHandoutConfigSchema>;
  export type ActiveHandoutUserConfig = z.input<typeof ActiveHandoutConfigSchema>;