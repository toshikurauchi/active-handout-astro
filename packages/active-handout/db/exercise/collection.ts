import { collection, doc } from "firebase/firestore";
import { handoutIdFromPath, handoutsRef } from "../handout/collection";
import { exerciseConverter } from "./converter";

export function exercisesRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const handoutRef = doc(handoutsRef(), pageId);
  return collection(handoutRef, "exercises").withConverter(exerciseConverter);
}

export function exerciseRef(handoutPath: string, slug: string) {
  return doc(exercisesRef(handoutPath), slug);
}
