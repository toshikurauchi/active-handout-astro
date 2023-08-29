export type ExerciseBaseProps = {
  pageId: string;
  slug: string;
  exerciseNumber: number;
  tags?: string[];
  children?: React.ReactNode;
};

export type Status = "unanswered" | "success" | "failed";
