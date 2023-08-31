import { FieldPath } from "firebase-admin/firestore";
import { getFirestore } from "../../firebase/server";
import { exercisesRef } from "../exercise/collection";
import { userSubmissionsConverter } from "./converter";
import { handoutIdFromPath } from "../handout/collection";

export function userSubmissionsCollectionRef(
  handoutPath: string,
  exerciseSlug: string
) {
  return exercisesRef(handoutPath)
    .doc(exerciseSlug)
    .collection("user-submissions")
    .withConverter(userSubmissionsConverter);
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
  return getFirestore()
    .collectionGroup("user-submissions")
    .where("pageId", "==", pageId)
    .where("userId", "==", userId)
    .withConverter(userSubmissionsConverter);
}
