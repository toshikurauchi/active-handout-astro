import { rehype } from "rehype";
import { CONTINUE, SKIP, visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";

const answerProcessor = rehype()
  .data("settings", { fragment: true })
  .use(function options() {
    return (tree, file) => {
      file.data.answer = "";

      visit(tree, "element", (node, index, parent) => {
        const classNames = (node.properties?.className ||
          []) as unknown as string[];
        if (
          !classNames ||
          !Array.isArray(classNames) ||
          !classNames.includes("exerciseAnswer")
        ) {
          return CONTINUE;
        }

        file.data.answer += toHtml(node.children.slice(1));
        parent?.children.splice(index as number, 1);

        return [SKIP, index];
      });
    };
  });

export function rehypeExtractAnswer(exerciseHTML: string): [string, string] {
  const file = answerProcessor.processSync({ value: exerciseHTML });
  return [file.data.answer as string, file.toString()];
}
