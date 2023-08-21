import { getEntry } from "astro:content";

export async function get404Entry() {
  const entry = await getEntry("handouts", "404");

  if (!entry) {
    return;
  }

  return entry;
}
