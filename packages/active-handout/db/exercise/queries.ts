import { setData } from "../../firebase/promisify";
import { exerciseRef, handoutIdFromPath } from "../../firebase/schema";
import { Exercise } from "./model";

export async function createExercise(
  slug: string,
  type: string,
  handoutPath: string,
  tags: string[] = [],
  data: any = {}
) {
  const pageId = handoutIdFromPath(handoutPath);
  const exercise = new Exercise(slug, pageId, type, tags, data);
  await setData(exerciseRef(handoutPath, slug), exercise.toJSON());
  return exercise;
}
