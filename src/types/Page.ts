import type { MarkdownInstance, MDXInstance } from 'astro'

export interface FrontMatter {
  title: string
  navigation?: {
    order: number
    show: boolean
    title?: string
  }
}

export type Page = MarkdownInstance<FrontMatter> | MDXInstance<FrontMatter>