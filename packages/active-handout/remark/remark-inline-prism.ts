// This is largely based on https://github.com/withastro/astro/blob/1f1c47d909fc96301b51a165fae4acdf43c276fc/packages/markdown/remark/src/remark-prism.ts
import { runHighlighterWithAstro } from "@astrojs/prism/dist/highlighter";
import { visit } from "unist-util-visit";

export function remarkInlinePrism() {
  return function (tree: any) {
    visit(tree, "inlineCode", (node) => {
      let { value } = node;
      if (!value.trim().startsWith("#!")) {
        return node;
      }
      const match = value.trim().match(/#!(\S*)\s(.*)/);
      const lang = match?.[1].trim();
      value = match?.[2];
      node.type = "html";

      const { html, classLanguage } = runHighlighterWithAstro(lang, value);
      const classes = [classLanguage];
      node.value = `<code is:raw class="${classes.join(" ")}">${html}</code>`;
    });
  };
}
