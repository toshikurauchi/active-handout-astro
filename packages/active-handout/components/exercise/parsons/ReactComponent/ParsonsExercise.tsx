import React, { useContext, useEffect } from "react";
import type { ExerciseBaseProps } from "../../props";
import ExerciseContainer, {
  ExerciseContext,
} from "../../container/ExerciseContainer";
import ParsonsLineContainer from "./ParsonsLineContainer";
import ExerciseSubmitButton from "../../submit-button/ExerciseSubmitButton";
import { getAnswerPointsFromLocalStorage } from "./utils";

type InnerProps = {
  htmlBefore: string;
  htmlAfter: string;
  answerHTML: string;
  lines: string[];
  registryKey: string;
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
      <InnerComponent {...innerProps} registryKey={props.registryKey} />
    </ExerciseContainer>
  );
}

function InnerComponent({
  htmlBefore,
  htmlAfter,
  lines,
  registryKey,
  withIndentation,
  maxIndentation,
  singleColumn,
}: InnerProps) {
  const [studentAnswer, setStudentAnswer] = React.useState<string>("");

  const {
    reloadData,
    setReloadData,
    setPoints,
    getTelemetry,
    setTelemetry,
    exerciseEnabled,
  } = useContext(ExerciseContext);

  // Update points and options status when requested by container
  useEffect(() => {
    if (!reloadData) return;

    getTelemetry().then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
      } else {
        setPoints(null);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const handleClick = () => {
    let percentComplete = getAnswerPointsFromLocalStorage(
      registryKey,
      studentAnswer
    );
    setTelemetry(percentComplete, {
      studentAnswer,
    }).then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
      }
    });
  };

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

      <ExerciseSubmitButton onClick={handleClick} disabled={!exerciseEnabled} />
    </div>
  );
}
