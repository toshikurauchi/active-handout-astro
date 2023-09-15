import type { TelemetryDataCache } from "../../db/telemetry-summary/model";

export interface ExerciseContainerProps {
  slug: string;
  tags: string[];
}

export type ExerciseBaseProps = {
  handoutPath: string;
  slug: string;
  exerciseNumber: number;
  latestSubmission?: TelemetryDataCache | null | undefined;
  tags?: string[];
  children?: React.ReactNode;
};

export type Status = "unanswered" | "success" | "partial-success" | "failed";
