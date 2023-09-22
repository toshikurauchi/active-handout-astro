export function extractTextRec(node: any, text: string[]) {
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
