import { getFirestore } from "../../firebase/server";
import { exercisesRef } from "../exercise/collection";
import { userSubmissionsConverter } from "./converter";
import { handoutIdFromPath } from "../handout/collection";
import {
  collection,
  collectionGroup,
  doc,
  query,
  where,
} from "firebase/firestore";

export function userSubmissionsCollectionRef(
  handoutPath: string,
  exerciseSlug: string
) {
  const exerciseRef = doc(exercisesRef(handoutPath), exerciseSlug);
  const submissionsRef = collection(exerciseRef, "user-submissions");
  return submissionsRef.withConverter(userSubmissionsConverter);
}

export function userSubmissionsRef(
  handoutPath: string,
  exerciseSlug: string,
  userId: string
) {
  return doc(userSubmissionsCollectionRef(handoutPath, exerciseSlug), userId);
}

export function userSubmissionsInHandout(handoutPath: string, userId: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const allUserSubmissions = collectionGroup(
    getFirestore(),
    "user-submissions"
  );
  const userSubmissionsQuery = query(
    allUserSubmissions,
    where("pageId", "==", pageId),
    where("userId", "==", userId)
  ).withConverter(userSubmissionsConverter);
  return userSubmissionsQuery;
}
