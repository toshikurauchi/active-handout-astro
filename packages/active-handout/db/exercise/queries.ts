import { getData, setData } from "../../firebase/promisify";
import { exerciseRef, handoutIdFromPath } from "../../firebase/schema";
import { Exercise } from "./model";

export async function createOrUpdateExercise(
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

export function getExercise(slug: string, handoutPath: string) {
  return getData(exerciseRef(handoutPath, slug), Exercise.fromJSON);
}
