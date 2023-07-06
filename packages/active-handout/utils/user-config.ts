import { z } from 'astro/zod';

export const ActiveHandoutConfigSchema = z.object({
    /** Title for your website. Will be used in metadata and as browser tab title. */
    title: z
      .string()
      .describe(
        'Title for your website. Will be used in metadata and as browser tab title.'
      ),
  
    /** Description metadata for your website. Can be used in page metadata. */
    description: z
      .string()
      .optional()
      .describe(
        'Description metadata for your website. Can be used in page metadata.'
      ),
  });
  
  export type ActiveHandoutConfig = z.infer<typeof ActiveHandoutConfigSchema>;
  export type ActiveHandoutUserConfig = z.input<typeof ActiveHandoutConfigSchema>;