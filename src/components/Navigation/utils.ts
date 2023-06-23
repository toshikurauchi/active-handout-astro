// Credits: a lot of the code in this page is based on https://github.com/tony-sull/astro-navigation/blob/main/src/utils.ts
import type { Page } from "../../types/Page"

type PageWithUrl = Page & {url: string}

export interface INavItem {
  title: string
  url: string
  order: number
  parent?: INavItem
  children?: INavItem[]
}

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

function buildEntryMap(pages: PageWithUrl[]) {
  const pageMap = new Map<string, INavItem>();
  pages.forEach((page) => {
    pageMap.set(page.url, {
      title: page.frontmatter?.navigation?.title || page.frontmatter.title || '',
      url: page.url,
      order: getOrder(page),
    });
  });
  return pageMap;
}

function findEntryParent(entry: INavItem, entryMap: Map<string, INavItem>) {
  let url = entry.url;
  while (url.length > 0) {
    url = url.split('/').slice(0, -1).join('/');
    const parent = entryMap.get(url);
    if (parent) {
      return parent;
    }
  }
}

function setEntryParents(entryMap: Map<string, INavItem>) {
  entryMap.forEach((page) => {
    const parent = findEntryParent(page, entryMap);
    if (parent) {
      page.parent = parent;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(page);
    }
  });
}

function sortChildren(entries: INavItem[]) {
  entries.forEach((entry) => {
    if (entry.children) {
      entry.children.sort((a, b) => a.order - b.order);
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

export function fetchNavTree() {
  const allPages = fetchPages().filter((page) => page.frontmatter?.navigation?.show !== false);

  const entryMap = buildEntryMap(allPages);
  setEntryParents(entryMap);
  sortChildren([...entryMap.values()]);

  return [...entryMap.values()].filter((entry) => !entry.parent).sort((a, b) => a.order - b.order);
}
