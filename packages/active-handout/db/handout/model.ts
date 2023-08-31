export class Handout {
  id: string;
  uri: string;

  constructor(id: string, uri: string) {
    this.id = id;
    this.uri = uri;
  }
  toString() {
    return this.uri;
  }
}
