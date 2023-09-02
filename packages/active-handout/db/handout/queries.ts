import { deleteData, getData } from "../../firebase/promisify";
import {
  handoutIdFromPath,
  handoutRef,
  telemetrySummariesForHandout,
} from "../../firebase/schema";
import { TelemetrySummary } from "../telemetry-summary/model";
import { Handout } from "./model";

type TelemetrySummaryMap = { [exerciseSlug: string]: TelemetrySummary };

export async function getHandoutWithExercisesAndSubmissions(
  handoutPath: string,
  userId: string,
  createIfNotExists: boolean = false
): Promise<[Handout | null, TelemetrySummaryMap | null]> {
  let [handout, submissions] = await Promise.all([
    getData(handoutRef(handoutPath), Handout.fromJSON),
    getData(telemetrySummariesForHandout(handoutPath, userId), (json) => {
      if (!json) return {} as TelemetrySummaryMap;
      const summaries: TelemetrySummaryMap = {};
      for (const exerciseSlug in json) {
        summaries[exerciseSlug] = TelemetrySummary.fromJSON(json[exerciseSlug]);
      }
      return summaries;
    }),
  ]);

  if (!handout && createIfNotExists) {
    handout = await createHandout(handoutPath);
  }
  return [handout, submissions];
}

export async function createHandout(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  const handout = new Handout(handoutPath, []);
  await handoutRef(pageId).set(handout);
  return handout;
}

export async function deleteHandout(handoutPath: string) {
  const pageId = handoutIdFromPath(handoutPath);
  await deleteData(handoutRef(pageId));
}
