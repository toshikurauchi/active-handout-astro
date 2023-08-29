import config from "virtual:active-handout/user-config";

import {
  dispatchRetrievedTelemetry,
  type AddTelemetryEvent,
  type RetrieveTelemetryEvent,
  ClearTelemetryEvent,
} from "./custom-events";

const useTelemetry = !!(config.telemetry && config.auth);
if (useTelemetry) {
  // TODO
} else {
  setupLocalStorageTelemetry();
}

function setupLocalStorageTelemetry() {
  document.addEventListener("AddTelemetry", (event: AddTelemetryEvent) => {
    const { pageId, slug, type, percentComplete, data } = event.detail;
    data.meta = {
      pageId,
      slug,
      type,
      percentComplete,
      timestamp: Date.now(),
    };

    localStorage.setItem(buildKey(pageId, slug), JSON.stringify(data));
  });

  document.addEventListener(
    "RetrieveTelemetry",
    (event: RetrieveTelemetryEvent) => {
      const { pageId, slug } = event.detail;

      const data = localStorage.getItem(buildKey(pageId, slug)) || "null";
      dispatchRetrievedTelemetry(pageId, slug, JSON.parse(data));
    }
  );

  document.addEventListener("ClearTelemetry", (event: ClearTelemetryEvent) => {
    const { pageId, slug } = event.detail;
    console.log("CLEAR", pageId, slug);

    if (slug) {
      localStorage.removeItem(buildKey(pageId, slug));
      return;
    }

    Object.keys(localStorage)
      .filter((key) => key.startsWith(`active-handout:telemetry:${pageId}:`))
      .forEach((key) => localStorage.removeItem(key));
  });
}

function buildKey(pageId: string, slug: string) {
  if (!pageId) throw new Error("pageId is required");
  if (!slug) throw new Error("slug is required");
  return `active-handout:telemetry:${pageId}:${slug}`;
}
