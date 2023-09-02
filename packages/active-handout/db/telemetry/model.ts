export class TelemetryData {
  id: string;
  userId: string;
  pageId: string;
  exerciseSlug: string;
  percentComplete: number;
  data: any;
  timestamp: number;

  static fromJSON(json: any) {
    return new TelemetryData(
      json.id,
      json.userId,
      json.pageId,
      json.exerciseSlug,
      json.percentComplete,
      json.data,
      json.timestamp
    );
  }

  constructor(
    id: string,
    userId: string,
    pageId: string,
    exerciseSlug: string,
    percentComplete: number,
    data: any,
    timestamp: number
  ) {
    this.id = id;
    this.userId = userId;
    this.pageId = pageId;
    this.exerciseSlug = exerciseSlug;
    this.percentComplete = percentComplete;
    this.data = data;
    this.timestamp = timestamp || Date.now();
  }

  toString() {
    return JSON.stringify(this);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      pageId: this.pageId,
      exerciseSlug: this.exerciseSlug,
      percentComplete: this.percentComplete,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}
