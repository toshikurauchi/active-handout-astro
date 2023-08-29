import type { Params } from "astro";

export function getAutoIncrementedExerciseNumber(
  astroParams: Params,
  slug: string
) {
  if (!slug) {
    throw new Error("Exercise slug cannot be empty");
  }

  const exerciseSlugs = JSON.parse(
    astroParams.exerciseSlugs || "[]"
  ) as string[];
  const slugIndex = exerciseSlugs.indexOf(slug);
  if (slugIndex >= 0) {
    return slugIndex + 1;
  }

  exerciseSlugs.push(slug);
  astroParams.exerciseSlugs = JSON.stringify(exerciseSlugs);

  return exerciseSlugs.length;
}
