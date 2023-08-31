import { handoutIdFromPath } from "../handout/collection";
import { exercisesRef } from "./collection";
import { Exercise } from "./model";

export async function getExercise(handoutPath: string, slug: string) {
  return (await exercisesRef(handoutPath).doc(slug).get()).data() as Exercise;
}

export async function createExercise(
  slug: string,
  type: string,
  handoutPath: string,
  tags: string[] = [],
  data: any = {}
) {
  const pageId = handoutIdFromPath(handoutPath);
  const exercise = new Exercise(slug, pageId, type, tags, data);
  exercisesRef(handoutPath).doc(slug).set(exercise);
  return exercise;
}
