import { collection, doc } from "firebase/firestore";
import { getFirestore } from "../../firebase/server";
import { telemetryDataConverter } from "./converter";

export function telemetriesRef() {
  return collection(getFirestore(), "telemetry").withConverter(
    telemetryDataConverter
  );
}

export function telemetryRef(id: string) {
  return doc(telemetriesRef(), id);
}
