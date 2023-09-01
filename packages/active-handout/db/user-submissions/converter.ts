import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { UserSubmissions } from "./model";

export const userSubmissionsConverter = {
  toFirestore: (userSubmissions: UserSubmissions) => {
    return {
      userId: userSubmissions.userId,
      pageId: userSubmissions.pageId,
      exerciseSlug: userSubmissions.exerciseSlug,
      submissionCount: userSubmissions.submissionCount,
      bestScore: userSubmissions.bestScore,
      latestTelemetryData: userSubmissions.latestTelemetryData,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<UserSubmissions>) => {
    const data = snapshot.data();
    return new UserSubmissions(
      data.userId,
      data.pageId,
      data.exerciseSlug,
      data.submissionCount,
      data.bestScore,
      data.latestTelemetryData
    );
  },
};
