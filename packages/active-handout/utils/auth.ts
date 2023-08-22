import { app } from "../firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function getUserFromCookie(sessionCookie: string | undefined) {
  const auth = getAuth(app);
  if (sessionCookie) {
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    return decodedCookie;
  }
  return null;
}
