import { handoutIdFromPath, handoutsRef } from "../handout/collection";
import { exerciseConverter } from "./converter";

export function exercisesRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const handoutRef = handoutsRef().doc(pageId);
  return handoutRef.collection("exercises").withConverter(exerciseConverter);
}

export function exerciseRef(handoutPath: string, slug: string) {
  return exercisesRef(handoutPath).doc(slug);
}
