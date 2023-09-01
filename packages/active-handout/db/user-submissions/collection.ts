import { getFirestore } from "../../firebase/server";
import { exercisesRef } from "../exercise/collection";
import { userSubmissionsConverter } from "./converter";
import { handoutIdFromPath } from "../handout/collection";

export function userSubmissionsCollectionRef(
  handoutPath: string,
  exerciseSlug: string
) {
  const exerciseRef = exercisesRef(handoutPath).doc(exerciseSlug);
  const submissionsRef = exerciseRef.collection("user-submissions");
  return submissionsRef.withConverter(userSubmissionsConverter);
}

export function userSubmissionsRef(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  return userSubmissionsCollectionRef(handoutPath, exerciseSlug).doc(userId);
}

export function userSubmissionsInHandout(handoutPath: string, userId: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const allUserSubmissions = getFirestore().collectionGroup("user-submissions");
  return allUserSubmissions
    .where("pageId", "==", pageId)
    .where("userId", "==", userId)
    .withConverter(userSubmissionsConverter);
}
