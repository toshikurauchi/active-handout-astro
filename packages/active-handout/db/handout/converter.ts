import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Handout } from "./model";

export const handoutConverter = {
  toFirestore: (handout: Handout) => {
    return {
      uri: handout.uri,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Handout>) => {
    const data = snapshot.data();
    return new Handout(snapshot.id, data.uri);
  },
};
