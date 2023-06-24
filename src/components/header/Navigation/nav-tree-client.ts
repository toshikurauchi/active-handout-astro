import type { NavTreeItem, SerializableNavItem } from "./types";

export function buildNavTree(entries: SerializableNavItem[]) {
  const treeEntries: NavTreeItem[] = entries.map((entry) => ({
    title: entry.title,
    url: entry.url,
    order: entry.order,
    isCurrent: entry.isCurrent,
  }))
  treeEntries.forEach((entry, idx) => {
    const parentIdx = entries[idx].parent;
    const childrenIdx = entries[idx].children;
    if (parentIdx !== undefined) {
      entry.parent = treeEntries[parentIdx];
    }
    if (childrenIdx !== undefined) {
      entry.children = childrenIdx.map((childIdx) => treeEntries[childIdx]);
    }
  });
  // Filter out entries that have a parent (they will be included as children)
  return treeEntries.filter((entry) => !entry.parent).sort((a, b) => a.order - b.order)
}