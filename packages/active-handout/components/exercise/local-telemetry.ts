/**
 * This file contains functions for saving and retrieving telemetry data from
 * the browser's local storage. This is used when the config.auth option is
 * disabled.
 */
import { TelemetryData } from "../../db/telemetry/model";

export function saveTelemetryToLocalStorage(
  handoutPath: string,
  slug: string,
  type: string,
  percentComplete: number,
  data: any
) {
  if (!handoutPath) throw new Error("handoutPath is required");
  if (!slug) throw new Error("slug is required");
  if (!type) throw new Error("type is required");
  if (percentComplete < 0 || percentComplete > 100)
    throw new Error("percentComplete must be between 0 and 100");

  const telemetryData = new TelemetryData(
    "unused",
    "nouser",
    handoutPath,
    slug,
    percentComplete,
    data,
    Date.now()
  );

  localStorage.setItem(
    buildKey(handoutPath, slug),
    JSON.stringify(telemetryData)
  );
  return Promise.resolve();
}

export function getTelemetryFromLocalStorage(
  handoutPath: string,
  slug: string
) {
  const serializedData = localStorage.getItem(buildKey(handoutPath, slug));
  return Promise.resolve(
    serializedData ? (JSON.parse(serializedData) as TelemetryData) : null
  );
}

export async function clearTelemetryFromLocalStorage(
  handoutPath: string,
  slug?: string
) {
  if (slug) {
    localStorage.removeItem(buildKey(handoutPath, slug));
    return;
  }

  Object.keys(localStorage)
    .filter((key) => key.startsWith(`active-handout:telemetry:${handoutPath}:`))
    .forEach((key) => localStorage.removeItem(key));

  return;
}

export function buildKey(handoutPath: string, slug: string) {
  if (!handoutPath) throw new Error("handoutPath is required");
  if (!slug) throw new Error("slug is required");
  return `active-handout:telemetry:${handoutPath}:${slug}`;
}
