import { rehype } from "rehype";
import rehypeParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeDocument from "rehype-document";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";

export function renderMarkdown(markdown: string): string {
  return rehype()
    .use(rehypeParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeDocument)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(markdown)
    .toString();
}
