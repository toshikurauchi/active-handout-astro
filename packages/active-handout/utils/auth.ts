import { app } from "../firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function getUserFromCookie(sessionCookie: string | undefined) {
  if (!app) return null;
  const auth = getAuth(app);
  if (sessionCookie) {
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    return decodedCookie;
  }
  return null;
}
