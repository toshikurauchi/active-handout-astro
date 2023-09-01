import { handoutIdFromPath } from "../handout/collection";
import { telemetriesRef, telemetryRef } from "./collection";
import { TelemetryData } from "./model";

export function getTelemetryData(telemetryDataId: string) {
  return telemetryRef(telemetryDataId).get();
}

export async function createTelemetryData(
  handoutPath: string,
  exerciseSlug: string,
  userId: string,
  percentComplete: number,
  data: any,
  timestamp?: number
) {
  const pageId = handoutIdFromPath(handoutPath);
  const inputData = new TelemetryData(
    "",
    userId,
    pageId,
    exerciseSlug,
    percentComplete,
    data,
    timestamp || Date.now()
  );
  const telemetryDataRef = await telemetriesRef().add(inputData);
  return (await telemetryDataRef.get()).data();
}
