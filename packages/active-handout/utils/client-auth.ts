import { Auth, signInWithEmailAndPassword } from "firebase/auth";

export async function signinToFirebaseWithCredentials(
  auth: Auth,
  email: string,
  password: string
) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user.getIdToken();
}

export async function login(idToken: string) {
  const nextUrl = getNextUrl();

  return fetch(`/api/auth/signin?next=${nextUrl}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}

function getNextUrl() {
  const searchParams = new URLSearchParams(document.location.search);
  return searchParams.get("next") || "/";
}
