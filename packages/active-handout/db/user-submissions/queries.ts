import { handoutIdFromPath } from "../handout/collection";
import { createTelemetryData } from "../telemetry/queries";
import { userSubmissionsInHandout, userSubmissionsRef } from "./collection";
import { UserSubmissions } from "./model";

export async function getUserSubmissions(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  const submissions = await userSubmissionsRef(
    handoutPath,
    exerciseSlug,
    userId
  ).get();
  return submissions?.data() || null;
}

export async function updateUserSubmissions(
  handoutPath: string,
  exerciseSlug: string,
  userId: string,
  percentComplete: number,
  data: any
) {
  const telemetryData = await createTelemetryData(
    handoutPath,
    exerciseSlug,
    userId,
    percentComplete,
    data
  );
  if (!telemetryData) throw new Error("Failed to create telemetry data");
  const submissionsRef = userSubmissionsRef(handoutPath, exerciseSlug, userId);
  let submissions = (await submissionsRef.get()).data();
  if (!submissions) {
    const pageId = handoutIdFromPath(handoutPath);
    submissions = new UserSubmissions(userId, pageId, exerciseSlug, 0, 0, null);
  }
  submissions.submissionCount++;
  submissions.bestScore = Math.max(submissions.bestScore, percentComplete);
  submissions.latestTelemetryData = {
    id: telemetryData.id,
    percentComplete: percentComplete,
    data: data,
    timestamp: telemetryData.timestamp,
  };
  await submissionsRef.set(submissions);
  return submissions;
}

export async function deleteLatestUserSubmission(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  const submissionsRef = userSubmissionsRef(handoutPath, exerciseSlug, userId);
  const submissions = await submissionsRef.get();
  if (!submissions.exists) {
    // Doesn't exist, so nothing to delete
    return;
  }
  await submissionsRef.update({ latestTelemetryData: null });
}

export async function deleteAllLatestUserSubmission(
  handoutPath: string,
  userId: string
) {
  const submissionsRef = userSubmissionsInHandout(handoutPath, userId);
  const submissions = await submissionsRef.get();
  for (const submissionsForExercise of submissions.docs) {
    await submissionsForExercise.ref.update({ latestTelemetryData: null });
  }
}
