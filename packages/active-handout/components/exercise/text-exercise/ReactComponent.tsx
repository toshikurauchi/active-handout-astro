import React, { useContext, useEffect, useState } from "react";
import ExerciseContainer, {
  ExerciseContext,
} from "../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import FormInput from "../../form-input/ReactFormInput";
import ExerciseSubmitButton from "../submit-button/ExerciseSubmitButton";

type TextExerciseProps = ExerciseBaseProps & {
  inputType?: string | undefined;
  multiline: boolean;
  validation?: string | undefined;
};

export default function TextExercise({ ...props }: TextExerciseProps) {
  return (
    <ExerciseContainer {...props}>
      <InnerComponent {...props}></InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  latestSubmission,
  baseHTML,
  validation,
  inputType,
  multiline,
}: TextExerciseProps) {
  const [studentAnswer, setStudentAnswer] = useState(
    latestSubmission?.data?.studentAnswer || null
  );

  const {
    reloadData,
    setReloadData,
    setPoints,
    getTelemetry,
    setTelemetry,
    exerciseEnabled,
  } = useContext(ExerciseContext);

  useEffect(() => {
    if (!reloadData) return;

    getTelemetry().then((telemetry) => {
      if (telemetry?.data?.studentAnswer) {
        setStudentAnswer(telemetry?.data?.studentAnswer);
      } else {
        setStudentAnswer(null);
      }
      setPoints(telemetry ? telemetry.percentComplete : null);

      setReloadData(false);
    });
  }, [reloadData]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentAnswer(event.target.value);
  };

  const handleClick = () => {
    let percentComplete = studentAnswer ? 100 : 0;
    if (
      validation &&
      studentAnswer &&
      !studentAnswer.match(new RegExp(validation))
    ) {
      percentComplete = 0;
    }
    setTelemetry(percentComplete, { studentAnswer }).then((telemetryData) => {
      setStudentAnswer(telemetryData?.data?.studentAnswer || null);
      setPoints(telemetryData ? telemetryData.percentComplete : null);
    });
  };

  return (
    <>
      <div
        className={Styles.contentContainer}
        dangerouslySetInnerHTML={{ __html: baseHTML }}
      ></div>
      <FormInput
        type={inputType || "text"}
        multiline={!!multiline}
        minLines={3} // Will be ignored if single line, so we're good
        onChange={handleTextChange}
        value={studentAnswer || ""}
        disabled={!exerciseEnabled}
      ></FormInput>

      <ExerciseSubmitButton
        onClick={handleClick}
        disabled={!exerciseEnabled || !studentAnswer}
      />
    </>
  );
}
