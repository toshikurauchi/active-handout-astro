export class TelemetryData {
  id: string;
  userId: string;
  pageId: string;
  exerciseSlug: string;
  percentComplete: number;
  data: any;
  timestamp: number;

  constructor(
    id: string,
    userId: string,
    pageId: string,
    exerciseSlug: string,
    percentComplete: number,
    data: any,
    timestamp?: number
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
}
