import { getFirestore } from "../../firebase/server";
import { handoutConverter } from "./converter";

export function handoutsRef() {
  const firestore = getFirestore();
  return firestore.collection("handouts").withConverter(handoutConverter);
}

export function handoutRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  return handoutsRef().doc(pageId);
}

export function handoutIdFromPath(handoutPath: string) {
  if (!handoutPath) throw new Error("No handout path provided");

  if (handoutPath.startsWith("/")) handoutPath = handoutPath.slice(1);
  if (handoutPath.endsWith("/")) handoutPath = handoutPath.slice(0, -1);
  if (!handoutPath) handoutPath = "index";
  return encodeURIComponent(handoutPath);
}
