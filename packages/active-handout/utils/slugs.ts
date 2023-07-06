export function slugToParam(slug: string): string | undefined {
  return slug === 'index' || slug === ''
    ? undefined
    : slug.endsWith('/index')
    ? slug.replace('/index', '')
    : slug;
}
