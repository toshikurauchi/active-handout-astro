import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthCredential,
  fetchSignInMethodsForEmail,
  getAuth,
  inMemoryPersistence,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthProvider,
} from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import { app } from "../firebase/client";

const auth = getAuth(app);
// This will prevent the browser from storing session data
auth.setPersistence(inMemoryPersistence);

type ProviderClass<Provider extends AuthProvider> = {
  new (): Provider;
  credentialFromError<Provider extends AuthProvider>(
    this: ProviderClass<Provider>,
    error: FirebaseError
  ): OAuthCredential | null;
};

export async function signinToFirebaseWithProvider<
  Provider extends AuthProvider,
>(ProviderClass: ProviderClass<Provider>) {
  const provider = new ProviderClass();
  const userCredential = await signInWithPopup(auth, provider).catch(
    async (error) => {
      if (
        error.hasOwnProperty("code") &&
        error.code === "auth/account-exists-with-different-credential"
      ) {
        const pendingCred = ProviderClass.credentialFromError(error);
        const email = error.customData.email;

        if (!pendingCred) {
          console.error("No pending credential found");
          return null;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        let otherProvider: AuthProvider;
        if (methods.includes("google.com")) {
          otherProvider = new GoogleAuthProvider();
        } else if (methods.includes("github.com")) {
          otherProvider = new GithubAuthProvider();
        } else {
          console.error("No other provider found");
          return null;
        }

        const existingUser = await signInWithPopup(auth, otherProvider);
        return linkWithCredential(existingUser.user, pendingCred);
      } else {
        console.error(error);
      }
      return null;
    }
  );

  if (!userCredential) {
    console.error("Error signing in");
    return;
  }

  const user = userCredential.user;
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/signin", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  auth.onAuthStateChanged(() => {
    if (res.redirected) {
      window.location.assign(res.url);
    }
  });
}

export async function signinToFirebaseWithCredentials(
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
