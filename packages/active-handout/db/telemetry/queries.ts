import { pushData } from "../../firebase/promisify";
import { handoutIdFromPath, telemetryRef } from "../../firebase/schema";
import { TelemetryData } from "./model";

export async function createTelemetryData(
  handoutPath: string,
  exerciseSlug: string,
  userId: string,
  percentComplete: number,
  data: any,
  timestamp: number
) {
  const pageId = handoutIdFromPath(handoutPath);
  const inputData = new TelemetryData(
    "",
    userId,
    pageId,
    exerciseSlug,
    percentComplete,
    data,
    timestamp
  );
  return await pushData(
    telemetryRef(handoutPath, exerciseSlug, userId),
    inputData.toJSON()
  );
}
