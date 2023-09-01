import { collection, doc } from "firebase/firestore";
import { getFirestore } from "../../firebase/server";
import { handoutConverter } from "./converter";

const firestore = getFirestore();

export function handoutsRef() {
  return collection(firestore, "handouts").withConverter(handoutConverter);
}

export function handoutRef(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  return doc(handoutsRef(), pageId);
}

export function handoutIdFromPath(handoutPath: string) {
  if (!handoutPath) throw new Error("No handout path provided");

  if (handoutPath.startsWith("/")) handoutPath = handoutPath.slice(1);
  if (handoutPath.endsWith("/")) handoutPath = handoutPath.slice(0, -1);
  if (!handoutPath) handoutPath = "index";
  return encodeURIComponent(handoutPath);
}
