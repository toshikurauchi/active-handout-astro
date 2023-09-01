import { deleteDoc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { exercisesRef } from "../exercise/collection";
import type { Exercise } from "../exercise/model";
import { userSubmissionsInHandout } from "../user-submissions/collection";
import type { UserSubmissions } from "../user-submissions/model";
import { handoutIdFromPath, handoutRef } from "./collection";
import { Handout } from "./model";

export async function getHandoutWithExercisesAndSubmissions(
  handoutPath: string,
  userId: string,
  createIfNotExists: boolean = false
): Promise<[Handout, Exercise[], UserSubmissions[]]> {
  const [handoutSnapshot, exercisesSnapshot, submissionsSnapshot] =
    await Promise.all([
      getDoc(handoutRef(handoutPath)),
      getDocs(exercisesRef(handoutPath)),
      getDocs(userSubmissionsInHandout(handoutPath, userId)),
    ]);

  let handout = handoutSnapshot.data();
  if (!handout && createIfNotExists) {
    handout = await createHandout(handoutPath);
  }
  return [
    handout as Handout,
    exercisesSnapshot.docs.map((doc) => doc.data()),
    submissionsSnapshot.docs.map((doc) => doc.data()),
  ];
}

export async function createHandout(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const handout = new Handout(pageId, handoutPath);
  await setDoc(handoutRef(pageId), handout);
  return handout;
}

export async function deleteHandout(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  await deleteDoc(handoutRef(pageId));
}
