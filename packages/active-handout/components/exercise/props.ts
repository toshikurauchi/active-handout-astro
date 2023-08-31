import type { TelemetryDataCache } from "../../db/user-submissions/model";

export type ExerciseBaseProps = {
  pageId: string;
  slug: string;
  exerciseNumber: number;
  latestSubmission?: TelemetryDataCache | null | undefined;
  tags?: string[];
  children?: React.ReactNode;
};

export type Status = "unanswered" | "success" | "failed";
