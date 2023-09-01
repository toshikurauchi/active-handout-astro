import type { QueryDocumentSnapshot } from "firebase/firestore";
import { Exercise } from "./model";

export const exerciseConverter = {
  toFirestore: (exercise: Exercise) => {
    return {
      slug: exercise.slug,
      pageId: exercise.pageId,
      type: exercise.type,
      tags: exercise.tags,
      data: exercise.data,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Exercise>) => {
    const data = snapshot.data();
    return new Exercise(
      data.slug,
      data.pageId,
      data.type,
      data.tags,
      data.data
    );
  },
};
