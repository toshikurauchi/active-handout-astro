import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { TelemetryData } from "./model";

export const telemetryDataConverter = {
  toFirestore: (telemetryData: TelemetryData) => {
    return {
      userId: telemetryData.userId,
      pageId: telemetryData.pageId,
      exerciseSlug: telemetryData.exerciseSlug,
      percentComplete: telemetryData.percentComplete,
      data: telemetryData.data,
      timestamp: Timestamp.fromMillis(telemetryData.timestamp),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<
      Omit<TelemetryData, "timestamp"> & { timestamp: Timestamp }
    >
  ) => {
    const data = snapshot.data();
    return new TelemetryData(
      snapshot.id,
      data.userId,
      data.pageId,
      data.exerciseSlug,
      data.percentComplete,
      data.data,
      data.timestamp.toMillis()
    );
  },
};
