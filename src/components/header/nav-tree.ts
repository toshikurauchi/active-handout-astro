// Credits: a lot of the code in this page is based on https://github.com/tony-sull/astro-navigation/blob/main/src/utils.ts
import type { Page } from "../../types/Page"

export interface NavTreeItem {
  id: number
  title: string
  url: string
  order: number
  isCurrent: boolean
  parent?: NavTreeItem
  children?: NavTreeItem[]
}

type PageWithUrl = Page & {url: string}

function pathToUrl(path: string) {
  const basePath = '/src/content/active-handout/';

  const start = path.indexOf(basePath) + basePath.length;
  const end = path.lastIndexOf('.')
  const cleanPath = path
  .substring(start, end)
  .replace(/\/index$/, '')
  .replace(/^\//, '')

  return `${import.meta.env.BASE_URL}${cleanPath || '/'}`;
}

function getOrder(page: Page) {
  const order = page.frontmatter?.navigation?.order;
  if (order === undefined) {
    return 99999;
  }
  return order;
}

function findEntryParent(entry: NavTreeItem, entryMap: Map<string, NavTreeItem>) {
  let url = entry.url;
  while (url.length > 0) {
    url = url.split('/').slice(0, -1).join('/');
    const parent = entryMap.get(url);
    if (parent) {
      return parent;
    }
  }
}

function setEntryRelationships(entries: NavTreeItem[]) {
  const entryMap = new Map(entries.map((entry) => [entry.url, entry]));
  entryMap.forEach((entry) => {
    const parent = findEntryParent(entry, entryMap);
    if (parent) {
      entry.parent = parent;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(entry);
    }
  });
}

function sortChildren(entries: NavTreeItem[]) {
  entries.forEach((entry) => {
    if (entry.children) {
      entry.children.sort((entryA, entryB) => entryA.order - entryB.order);
    }
  });
}

export function fetchPages() {
  const results = import.meta.glob<Page>(
    ['/src/content/active-handout/**/*.md', '/src/content/active-handout/**/*.mdx', '/src/content/active-handout/**/*.astro'],
    { eager: true }
  )
  return Object.values<Page>(results).map((page) => ({
    ...page,
    url: pathToUrl(page.file),
  })) as PageWithUrl[]
}

export function fetchNavEntries(slug: string) {
  const allPages = fetchPages().filter((page) => page.frontmatter?.navigation?.show !== false);
  const entries = allPages.map((page, idx) => ({id: idx,
    title: page.frontmatter?.navigation?.title || page.frontmatter.title || '',
    url: page.url,
    order: getOrder(page),
    isCurrent: page.url === `${import.meta.env.BASE_URL}${slug}`,
    parent: undefined,
    children: undefined,
  }));

  setEntryRelationships(entries);
  sortChildren(entries);

  return entries.filter((entry) => !entry.parent).sort((entryA, entryB) => entryA.order - entryB.order);
}
