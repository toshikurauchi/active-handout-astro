import type { TelemetryDataCache } from "../../db/telemetry-summary/model";

export interface ExerciseContainerProps {
  slug: string;
  tags: string[];
}

export type ExerciseBaseProps = {
  handoutPath: string;
  slug: string;
  exerciseData?: any;
  exerciseType: string;
  registryKey: string;
  exerciseNumber: number;
  answerHTML?: string;
  answerTitleRight?: React.ReactNode;
  baseHTML: string;
  latestSubmission?: TelemetryDataCache | null | undefined;
  children?: React.ReactNode;
  allowsEditing?: boolean;
};

export type Status = "unanswered" | "success" | "partial-success" | "failed";
