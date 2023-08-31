export class Exercise {
  slug: string;
  type: string;
  tags: string[];
  pageId: string;
  data?: any;

  constructor(
    slug: string,
    pageId: string,
    type: string,
    tags: string[],
    data?: any
  ) {
    this.slug = slug;
    this.pageId = pageId;
    this.type = type;
    this.tags = tags;
    this.data = data;
  }
  toString() {
    return `${this.pageId}/${this.slug}`;
  }
}
