/**
 * This file contains functions for saving and retrieving telemetry data from
 * the server on the browser. This is used when the config.auth option is
 * enabled.
 */

import { TelemetryData } from "../../db/telemetry/model";

export async function getTelemetryDataFromServer(
  handoutPath: string,
  exerciseSlug: string
) {
  const response = await fetch(
    `/api/telemetry?handoutPath=${handoutPath}&exerciseSlug=${exerciseSlug}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to get telemetry data from server");
  }
  return response.json();
}

export async function postTelemetryDataToServer(
  handoutPath: string,
  slug: string,
  _: string, // type: string (unused)
  percentComplete: number,
  data: any
) {
  const formData = new FormData();
  formData.append("handoutPath", handoutPath);
  formData.append("exerciseSlug", slug);
  formData.append("percentComplete", percentComplete.toString());
  formData.append("data", JSON.stringify(data));

  const response = await fetch("/api/telemetry", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to post telemetry data to server");
  }
}

export async function clearTelemetryFromServer(
  handoutPath: string,
  slug?: string | undefined
) {
  const formData = new FormData();
  formData.append("handoutPath", handoutPath);
  if (slug) {
    formData.append("exerciseSlug", slug);
  }

  const response = await fetch("/api/telemetry", {
    method: "DELETE",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to post telemetry data to server");
  }
}
