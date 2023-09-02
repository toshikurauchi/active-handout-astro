/**
 * Firebase schema
 *
 * This file contains functions that return Firebase references for the
 * different parts of the database. This is used when the config.auth option is
 * enabled.
 *
 * Some data is duplicated in the database to make it easier to query.
 *
 * Overall schema:
 * /handouts
 *  /{handoutId}
 *    /exercises
 *      /{exerciseSlug}
 * /telemetry
 *  /{userId}
 *    /handouts
 *      /{handoutId}
 *        /exercises
 *          /{exerciseSlug}
 *            /[array of telemetry data]
 * /telemetry-summary
 *  /{handoutId}
 *    /users
 *      /{userId}
 *        /exercises
 *          /{exerciseSlug}
 */

import { db } from "./server";

export function handoutIdFromPath(handoutPath: string) {
  if (!handoutPath) throw new Error("No handout path provided");

  if (handoutPath.startsWith("/")) handoutPath = handoutPath.slice(1);
  if (handoutPath.endsWith("/")) handoutPath = handoutPath.slice(0, -1);
  if (!handoutPath) handoutPath = "index";
  return encodeURIComponent(handoutPath);
}

export function handoutRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  return db.ref(`/handouts/${pageId}`);
}

export function exerciseRef(handoutPath: string, slug: string) {
  const pageId = handoutIdFromPath(handoutPath);
  return db.ref(`/handouts/${pageId}/exercises/${slug}`);
}

export function telemetryRef(
  handoutPath: string,
  slug: string,
  userId: string
) {
  const pageId = handoutIdFromPath(handoutPath);
  return db.ref(`/telemetry/${userId}/handouts/${pageId}/exercises/${slug}`);
}

export function telemetrySummaryRef(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  const pageId = handoutIdFromPath(handoutPath);
  return db.ref(
    `/telemetry-summary/${pageId}/users/${userId}/exercises/${exerciseSlug}`
  );
}

export function telemetrySummariesForHandout(
  handoutPath: string,
  userId: string
) {
  const pageId = handoutIdFromPath(handoutPath);
  return db.ref(`/telemetry-summary/${pageId}/users/${userId}/exercises`);
}
