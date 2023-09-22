import { rehype } from "rehype";
import { SKIP, visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { extractTextRec } from "../../../utils/extract-text-from-node";

export type ParsonsLine = {
  plainContent: string;
  htmlContent: string;
  distractor: boolean;
  indent: number;
};

const linesProcessor = rehype()
  .data("settings", { fragment: true })
  .use(function options() {
    return (tree, file) => {
      file.data.lines = [];
      file.data.htmlBefore = "";
      file.data.htmlAfter = "";
      const lines = file.data.lines as ParsonsLine[];

      let foundLines = false;
      visit(tree, "element", (node) => {
        const classNames = (node.properties?.className ||
          []) as unknown as string[];
        if (
          !classNames ||
          !Array.isArray(classNames) ||
          !classNames.includes("parsons-line")
        ) {
          if (foundLines) {
            file.data.htmlAfter += toHtml(node);
          } else {
            file.data.htmlBefore += toHtml(node);
          }
          return SKIP;
        }

        foundLines = true;

        const textLines: string[] = [];
        extractTextRec(node, textLines);

        let indent = 0;
        if (node.properties.dataIndent) {
          indent = node.properties.dataIndent;
          delete node.properties.dataIndent;
        }

        lines.push({
          plainContent: textLines.join(""),
          htmlContent: toHtml(node.children),
          distractor: classNames.includes("distractor"),
          indent,
        });
        node.properties.className = "";

        return SKIP;
      });
    };
  });

export function rehypeExtractParsonsLines(exerciseHTML: string) {
  const file = linesProcessor.processSync({ value: exerciseHTML });
  return {
    lines: file.data.lines,
    htmlBefore: file.data.htmlBefore,
    htmlAfter: file.data.htmlAfter,
  } as {
    lines: ParsonsLine[];
    htmlBefore: string;
    htmlAfter: string;
  };
}
