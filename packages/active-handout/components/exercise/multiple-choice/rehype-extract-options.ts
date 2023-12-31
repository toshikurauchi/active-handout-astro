import { rehype } from "rehype";
import { SKIP, visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { extractTextRec } from "../../../utils/extract-text-from-node";

export type Option = {
  plainContent: string;
  htmlContent: string;
  points: number;
};

const optionsProcessor = rehype()
  .data("settings", { fragment: true })
  .use(function options() {
    return (tree, file) => {
      file.data.options = [];
      file.data.htmlBefore = "";
      file.data.htmlAfter = "";
      const options = file.data.options as Option[];

      let foundOptions = false;
      visit(tree, "element", (node) => {
        const classNames = (node.properties?.className ||
          []) as unknown as string[];
        if (
          !classNames ||
          !Array.isArray(classNames) ||
          !classNames.includes("multiple-choice-option")
        ) {
          if (foundOptions) {
            file.data.htmlAfter += toHtml(node);
          } else {
            file.data.htmlBefore += toHtml(node);
          }
          return SKIP;
        }

        foundOptions = true;

        const lines: string[] = [];
        extractTextRec(node, lines);

        const points = parseInt((node.properties?.dataPoints || "0") as string);
        delete node.properties?.dataPoints;

        options.push({
          plainContent: lines.join("").trim(),
          htmlContent: toHtml(node.children),
          points,
        });

        return SKIP;
      });
    };
  });

export function rehypeExtractOptions(exerciseHTML: string) {
  const file = optionsProcessor.processSync({ value: exerciseHTML });
  return {
    options: file.data.options,
    htmlBefore: file.data.htmlBefore,
    htmlAfter: file.data.htmlAfter,
  } as {
    options: Option[];
    htmlBefore: string;
    htmlAfter: string;
  };
}
