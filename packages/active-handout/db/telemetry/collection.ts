import { getFirestore } from "../../firebase/server";
import { telemetryDataConverter } from "./converter";

export function telemetriesRef() {
  return getFirestore()
    .collection("telemetry")
    .withConverter(telemetryDataConverter);
}

export function telemetryRef(id: string) {
  return telemetriesRef().doc(id);
}
