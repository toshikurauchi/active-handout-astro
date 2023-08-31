export type TelemetryDataCache = {
  id: string;
  percentComplete: number;
  data: any;
  timestamp: number;
};

export class UserSubmissions {
  userId: string;
  pageId: string;
  exerciseSlug: string;
  submissionCount: number;
  bestScore: number;
  latestTelemetryData?: TelemetryDataCache | null | undefined;

  constructor(
    userId: string,
    pageId: string,
    exerciseSlug: string,
    submissionCount: number,
    bestScore: number,
    latestTelemetryData?: TelemetryDataCache | null | undefined
  ) {
    this.userId = userId;
    this.pageId = pageId;
    this.exerciseSlug = exerciseSlug;
    this.submissionCount = submissionCount;
    this.bestScore = bestScore;
    this.latestTelemetryData = latestTelemetryData;
  }
  toString() {
    return JSON.stringify(this);
  }
}
