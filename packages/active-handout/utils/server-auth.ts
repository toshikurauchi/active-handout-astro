import type { AstroCookies } from "astro";
import { app } from "../firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function getUserFromCookie(cookies: AstroCookies) {
  const sessionCookie = cookies.get("session")?.value;

  if (!app || !sessionCookie) return null;
  const auth = getAuth(app);
  try {
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    return decodedCookie;
  } catch (e) {
    return null;
  }
}

export async function setUserCookie(cookies: AstroCookies, idToken: string) {
  const auth = getAuth(app);

  /* Create and set session cookie */
  const fiveDays = 1000 * 60 * 60 * 24 * 5;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  });

  cookies.set("session", sessionCookie, {
    path: "/",
  });
}

export async function removeUserCookie(cookies: AstroCookies) {
  cookies.delete("session", {
    path: "/",
  });
}
