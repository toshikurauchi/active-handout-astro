import React from "react";
import type { ExerciseBaseProps } from "../../props";
import ExerciseContainer from "../../container/ExerciseContainer";
import ParsonsLineContainer from "./ParsonsLineContainer";

type InnerProps = {
  htmlBefore: string;
  htmlAfter: string;
  answerHTML: string;
  lines: string[];
  withIndentation: boolean;
  maxIndentation?: number | undefined;
  singleColumn: boolean;
};

type ParsonsExerciseProps = ExerciseBaseProps & InnerProps;

export default function ParsonsExercise({
  htmlBefore,
  htmlAfter,
  lines,
  answerHTML,
  withIndentation,
  maxIndentation,
  singleColumn,
  ...props
}: ParsonsExerciseProps) {
  const innerProps = {
    htmlBefore,
    htmlAfter,
    lines,
    answerHTML,
    withIndentation,
    maxIndentation,
    singleColumn,
  };
  return (
    <ExerciseContainer {...props}>
      <InnerComponent {...innerProps} />
    </ExerciseContainer>
  );
}

function InnerComponent({
  htmlBefore,
  htmlAfter,
  lines,
  withIndentation,
  maxIndentation,
  singleColumn,
}: InnerProps) {
  const [studentAnswer, setStudentAnswer] = React.useState<string>("");
  console.log(studentAnswer);

  return (
    <div className="parsons">
      {htmlBefore && <div dangerouslySetInnerHTML={{ __html: htmlBefore }} />}

      <ParsonsLineContainer
        lines={lines}
        withIndentation={withIndentation}
        maxIndentation={maxIndentation || 5}
        singleColumn={singleColumn}
        onAnswerChanged={setStudentAnswer}
      />

      {htmlAfter && <div dangerouslySetInnerHTML={{ __html: htmlAfter }} />}
    </div>
  );
}
