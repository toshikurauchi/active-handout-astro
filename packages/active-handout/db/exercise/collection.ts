import { handoutIdFromPath, handoutsRef } from "../handout/collection";
import { exerciseConverter } from "./converter";

export function exercisesRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  return handoutsRef()
    .doc(pageId)
    .collection("exercises")
    .withConverter(exerciseConverter);
}
