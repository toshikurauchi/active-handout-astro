export type ClearTelemetryEvent = CustomEvent;

export function dispatchClearTelemetry() {
  const event = new CustomEvent("ClearTelemetry");
  document.dispatchEvent(event);
}
