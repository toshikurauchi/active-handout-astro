// This is heavily inspired by the following code: https://github.com/withastro/starlight/blob/03aabcfcf4cea879414daabc7b65c4548bef6644/packages/starlight/user-components/rehype-tabs.ts
import { rehype } from "rehype";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

/**
 * Rehype processor to extract label data
 */
const tabsProcessor = rehype()
  .data("settings", { fragment: true })
  .use(function tabs() {
    return (tree, file) => {
      file.data.labels = [];
      const labels = file.data.labels as string[];
      let isFirst = true;
      visit(tree, "element", (node) => {
        if (!node.properties?.dataLabel) {
          return CONTINUE;
        }

        const { dataLabel } = node.properties;
        labels.push(String(dataLabel));
        delete node.properties.dataLabel;

        if (isFirst) {
          isFirst = false;
          if (!node.properties.className) {
            node.properties.className = "active";
          } else {
            node.properties.className += " active";
          }
        }

        // Skip over the tab panel’s children.
        return SKIP;
      });
    };
  });

/**
 * Process tab items to extract labels.
 * @param html Inner HTML passed to the `<TabGroup>` component.
 */
export const processPanels = (html: string) => {
  const file = tabsProcessor.processSync({ value: html });
  return {
    /** Data for each tab label. */
    labels: file.data.labels as string[],
    /** Processed HTML for the tabs. */
    html: file.toString(),
  };
};
