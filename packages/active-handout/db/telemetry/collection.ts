import { getFirestore } from "../../firebase/server";
import { telemetryDataConverter } from "./converter";

export function telemetryRef() {
  return getFirestore()
    .collection("telemetry")
    .withConverter(telemetryDataConverter);
}
