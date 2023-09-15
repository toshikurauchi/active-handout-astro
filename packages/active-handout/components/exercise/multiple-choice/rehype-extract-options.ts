import { rehype } from "rehype";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

function extractTextRec(node: any, text: string[]) {
  if (node.type === "text") {
    text.push(node.value);
  } else if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => extractTextRec(child, text));
    if (node.tagName === "p") {
      text.push("\n");
    }
  } else if (node.tagName === "img" && node.properties.alt) {
    text.push(node.properties.alt);
  }
}

const optionsProcessor = rehype()
  .data("settings", { fragment: true })
  .use(function options() {
    return (tree, file) => {
      file.data.options = [];
      const options = file.data.options as {
        content: string;
        correct: boolean;
      }[];

      visit(tree, "element", (node) => {
        if (!node.properties?.className) return CONTINUE;
        if (!Array.isArray(node.properties.className)) return CONTINUE;
        const classNames = node.properties.className as unknown as string[];
        if (!classNames.includes("exercise-option")) {
          return CONTINUE;
        }

        const lines: string[] = [];
        extractTextRec(node, lines);

        const isCorrect = node.properties.dataCorrect === "correct";
        delete node.properties.dataCorrect;

        options.push({
          content: lines.join("").trim(),
          correct: isCorrect,
        });

        // Skip over the tab panel’s children.
        return SKIP;
      });
    };
  });

export function rehypeExtractOptions(exerciseHTML: string) {
  const file = optionsProcessor.processSync({ value: exerciseHTML });
  return { options: file.data.options, html: file.toString() };
}
