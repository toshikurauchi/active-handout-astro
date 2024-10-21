import type { APIRoute } from "astro";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";
import { app, getStorage } from "../../../firebase/server";
import {
  getUserFromCookie,
  removeUserCookie,
  setUserCookie,
} from "../../../utils/server-auth";
import { getDownloadURL } from "firebase-admin/storage";

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const auth = getAuth(app);
  const user = await getUserFromCookie(cookies);

  if (!user) {
    return redirect("/signin?next=/profile");
  }

  /* Get form data */
  const formData = await request.formData();
  const imgFile = formData.get("profile-pic") as File | null;
  const name = formData.get("display-name")?.toString();

  const profilePicUrl =
    imgFile && imgFile.size > 0
      ? await saveProfilePic(user, imgFile as File)
      : user.picture;

  /* Create user */
  try {
    await auth.updateUser(user.uid, {
      displayName: name || null,
      photoURL: profilePicUrl || null,
    });
    removeUserCookie(cookies);
    return redirect("/signin");
  } catch (error: any) {
    return new Response("Something went wrong", { status: 400 });
  }
};

async function saveProfilePic(user: DecodedIdToken, profilePic: File) {
  const storage = getStorage();
  const filename = `users/${user.uid}/profile-pic/${profilePic.name}`;
  const buffer = Buffer.from(await profilePic.arrayBuffer());
  const fileRef = storage.bucket().file(filename);
  await fileRef.save(Buffer.from(buffer));
  return await getDownloadURL(fileRef);
}
