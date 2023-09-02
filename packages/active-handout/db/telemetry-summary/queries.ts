import {
  getData,
  transactionUpdate,
  updateData,
} from "../../firebase/promisify";
import {
  handoutIdFromPath,
  telemetrySummariesForHandout,
  telemetrySummaryRef,
} from "../../firebase/schema";
import { createTelemetryData } from "../telemetry/queries";
import { TelemetryDataCache, TelemetrySummary } from "./model";

export async function getTelemetrySummary(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  return await getData(
    telemetrySummaryRef(handoutPath, exerciseSlug, userId),
    TelemetrySummary.fromJSON
  );
}

export async function createOrUpdateTelemetrySummary(
  handoutPath: string,
  exerciseSlug: string,
  userId: string,
  latestTelemetryData: TelemetryDataCache
) {
  const pageId = handoutIdFromPath(handoutPath);
  await transactionUpdate(
    telemetrySummaryRef(handoutPath, exerciseSlug, userId),
    (telemetrySummary) => {
      if (!telemetrySummary) {
        telemetrySummary = new TelemetrySummary(
          userId,
          pageId,
          exerciseSlug,
          0,
          0,
          latestTelemetryData
        ).toJSON();
      }
      latestTelemetryData.index = telemetrySummary.submissionCount;
      telemetrySummary.submissionCount++;
      telemetrySummary.bestScore = Math.max(
        telemetrySummary.bestScore,
        latestTelemetryData.percentComplete
      );
      telemetrySummary.latestTelemetryData = latestTelemetryData;
      return telemetrySummary;
    }
  );
}

export async function updateTelemetrySummary(
  handoutPath: string,
  exerciseSlug: string,
  userId: string,
  percentComplete: number,
  data: any,
  timestamp?: number
) {
  if (!timestamp) timestamp = Date.now();

  await Promise.all([
    createTelemetryData(
      handoutPath,
      exerciseSlug,
      userId,
      percentComplete,
      data,
      timestamp
    ),
    createOrUpdateTelemetrySummary(handoutPath, exerciseSlug, userId, {
      index: -1,
      percentComplete,
      data,
      timestamp,
    }),
  ]);
}

export async function deleteLatestUserSubmission(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  updateData(telemetrySummaryRef(handoutPath, exerciseSlug, userId), {
    latestTelemetryData: null,
  });
}

export async function deleteAllLatestUserSubmission(
  handoutPath: string,
  userId: string
) {
  await transactionUpdate(
    telemetrySummariesForHandout(handoutPath, userId),
    (exercises) => {
      for (const summary of Object.values<TelemetrySummary>(exercises)) {
        summary.latestTelemetryData = null;
      }
      return exercises;
    }
  );
}
