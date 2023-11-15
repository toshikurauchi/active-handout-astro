import { marked } from "marked";
import markedKatex from "marked-katex-extension";

export function renderMarkdown(markdown: string): string {
  marked.use(markedKatex({ throwOnError: false }));
  return marked.parse(
    markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
  );
}
