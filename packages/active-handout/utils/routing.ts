import type { GetStaticPathsItem } from "astro";
import { CollectionEntry, getCollection } from "astro:content";
import { slugToParam } from "./slugs";

export interface NavTreeItem {
  title: string;
  url: string | undefined;
  order: number;
  isCurrent: boolean;
  parent?: NavTreeItem | undefined;
  children?: NavTreeItem[] | undefined;
}

export type ActiveHandoutEntry = Omit<CollectionEntry<"handouts">, "slug"> & {
  slug: string;
};

export interface Route {
  entry: ActiveHandoutEntry;
  slug: string;
  id: string;
  isFallback?: true;
  [key: string]: unknown;
}

interface Path extends GetStaticPathsItem {
  params: { slug: string | undefined };
  props: Route;
}

/**
 * Astro is inconsistent in its `index.md` slug generation. In most cases,
 * `index` is stripped, but in the root of a collection, we get a slug of `index`.
 * We map that to an empty string for consistent behaviour.
 */
const normalizeIndexSlug = (slug: string) => (slug === "index" ? "" : slug);

/** All entries in the handouts content collection. */
const handouts: ActiveHandoutEntry[] = (await getCollection("handouts"))
  .map(({ slug, ...entry }) => ({ ...entry, slug: normalizeIndexSlug(slug) }))
  .filter((entry) => entry.data.navigation?.show !== false);

function findEntryParent(
  entry: NavTreeItem,
  entryMap: Map<string | undefined, NavTreeItem>
) {
  let url = entry.url;

  if (!url) return;

  while (url.length > 0) {
    url = url.split("/").slice(0, -1).join("/");
    const parent = entryMap.get(url);
    if (parent) {
      return parent;
    }
  }

  return undefined;
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
function listAllNavEntries(currentSlug?: string): NavTreeItem[] {
  const entries = handouts.map((entry) => ({
    title: entry.data.navigation?.title || entry.data.title || "",
    url: slugToParam(entry.slug) || "/",
    order: getOrder(entry),
    isCurrent: (entry.slug || undefined) === currentSlug,
    parent: undefined,
    children: undefined,
  }));

  setEntryRelationships(entries);
  sortChildren(entries);

  return entries;
}
export function getNavEntries(currentSlug?: string): NavTreeItem[] {
  const entries = listAllNavEntries(currentSlug);

  return entries
    .filter((entry) => !entry.parent)
    .sort((entryA, entryB) => entryA.order - entryB.order);
}

function getCurrentEntry(currentSlug?: string): NavTreeItem | undefined {
  const allEntries = listAllNavEntries(currentSlug);
  let currentEntry;
  for (let entry of allEntries) {
    if (entry.isCurrent) {
      currentEntry = entry;
      break;
    }
  }
  return currentEntry;
}

export function getBreadcrumbEntries(currentSlug?: string): NavTreeItem[] {
  let entry = getCurrentEntry(currentSlug)?.parent;
  const breadcrumbs: NavTreeItem[] = [];

  while (entry) {
    breadcrumbs.push(entry);
    entry = entry.parent;
  }

  return breadcrumbs.reverse();
}

function getOrder(entry: ActiveHandoutEntry) {
  const order = entry.data.navigation?.order;
  if (order === undefined) {
    return 99999;
  }
  return order;
}

function getRoutes(): Route[] {
  const routes: Route[] = handouts.map((entry) => ({
    entry,
    slug: entry.slug,
    id: entry.id,
  }));

  // Sort alphabetically by page slug to guarantee order regardless of platform.
  return routes.sort((a, b) =>
    a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0
  );
}
export const routes = getRoutes();

function getPaths(): Path[] {
  return routes.map((route) => ({
    params: { slug: slugToParam(route.slug) },
    props: route,
  }));
}
export const paths = getPaths();
