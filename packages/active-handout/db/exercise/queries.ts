import { handoutIdFromPath } from "../handout/collection";
import { exerciseRef } from "./collection";
import { Exercise } from "./model";

export async function getExercise(handoutPath: string, slug: string) {
  const exerciseDoc = exerciseRef(handoutPath, slug);
  return (await exerciseDoc.get())?.data();
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
  const exerciseDoc = exerciseRef(handoutPath, slug);
  await exerciseDoc.set(exercise);
  return exercise;
}
