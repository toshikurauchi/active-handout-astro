export type TelemetryDataCache = {
  index: number;
  percentComplete: number;
  data: any;
  timestamp: number;
};

export class TelemetrySummary {
  userId: string;
  pageId: string;
  exerciseSlug: string;
  submissionCount: number;
  bestScore: number;
  latestTelemetryData: TelemetryDataCache | null | undefined;

  static fromJSON(json: any) {
    return new TelemetrySummary(
      json.userId,
      json.pageId,
      json.exerciseSlug,
      json.submissionCount,
      json.bestScore,
      json.latestTelemetryData
    );
  }

  constructor(
    userId: string,
    pageId: string,
    exerciseSlug: string,
    submissionCount: number,
    bestScore: number,
    latestTelemetryData: TelemetryDataCache | null | undefined
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

  toJSON() {
    return {
      userId: this.userId,
      pageId: this.pageId,
      exerciseSlug: this.exerciseSlug,
      submissionCount: this.submissionCount,
      bestScore: this.bestScore,
      latestTelemetryData: this.latestTelemetryData,
    };
  }
}
