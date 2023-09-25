export type ParsonsLineData = {
  htmlContent: string;
  plainContent: string;
  indent: number;
};

export type ParsonsCompleteLineData = ParsonsLineData & {
  distractor: boolean;
};
