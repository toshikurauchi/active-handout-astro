import { z } from 'astro/zod';

export function i18nSchema() {
  return starlightI18nSchema()
}

export function builtinI18nSchema() {
  return starlightI18nSchema().required().strict();
}

function starlightI18nSchema() {
  return z
    .object({
      'skipLink.label': z
        .string()
        .describe(
          'Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page.'
        ),

      '404.text': z
        .string()
        .describe('Text shown on Active Handout’s default 404 page'),

      '404.title': z
        .string()
        .describe('Title shown on Active Handout’s default 404 page')
    })
    .partial();
}
