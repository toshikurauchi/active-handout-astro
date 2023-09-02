export class Exercise {
  slug: string;
  pageId: string;
  type: string;
  tags: string[];
  data: any | undefined;

  static fromJSON(json: any) {
    return new Exercise(
      json.slug,
      json.pageId,
      json.type,
      json.tags,
      json.data
    );
  }

  constructor(
    slug: string,
    pageId: string,
    type: string,
    tags: string[],
    data: any
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

  toJSON() {
    return {
      slug: this.slug,
      pageId: this.pageId,
      type: this.type,
      tags: this.tags,
      data: this.data,
    };
  }
}
