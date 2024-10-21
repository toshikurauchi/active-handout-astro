import { type DecodedIdToken, getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export async function extractUserFromRequest(
  request: Request
): Promise<[string | null, DecodedIdToken | null, string]> {
  const auth = getAuth(app);

  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return [null, null, "No token found"];
  }

  /* Verify id token */
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return [idToken, decodedToken, "OK"];
  } catch (error) {
    return [null, null, "Invalid token"];
  }
}
