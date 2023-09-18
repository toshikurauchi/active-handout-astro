import React, { useContext, useEffect, useState } from "react";
import ExerciseContainer, {
  ExerciseContext,
} from "../../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../../props";
import type { Option as OptionData } from "../rehype-extract-options";
import { getOptionPointsFromLocalStorage } from "./utils";
import ExerciseSubmitButton from "../../submit-button/ExerciseSubmitButton";
import type { ColumnCount, LetterPosition } from "./props";
import Options from "./Options";

type MultipleChoiceExerciseProps = ExerciseBaseProps & {
  htmlBefore: string;
  htmlAfter: string;
  answerHTML: string;
  options: OptionData[];
  columns: ColumnCount;
  letterPosition: LetterPosition;
};

export const exerciseType = "multiple-choice";

export default function MultipleChoiceExercise(
  props: MultipleChoiceExerciseProps
) {
  // We need this wrapper because of the context
  // provider that is set on the container
  return (
    <ExerciseContainer {...props}>
      <InnerComponent {...props} />
    </ExerciseContainer>
  );
}

function InnerComponent(props: MultipleChoiceExerciseProps) {
  const {
    registryKey,
    htmlBefore,
    htmlAfter,
    latestSubmission,
    options,
    columns,
    letterPosition,
  } = props;

  const [selectedOption, setSelectedOption] = useState<number | null>(
    latestSubmission?.data?.option ?? null
  );

  const initialPoints = latestSubmission?.percentComplete;
  const [points, setPoints] = useState<number | null>(
    typeof initialPoints === "undefined" ? null : initialPoints
  );
  const {
    reloadData,
    setReloadData,
    setStatus,
    getTelemetry,
    setTelemetry,
    exerciseEnabled,
  } = useContext(ExerciseContext);

  // Update exercise status when points change
  useEffect(() => {
    if (points === null) {
      setStatus("unanswered");
    } else {
      setStatus(
        points < 100 ? (points < 10 ? "failed" : "partial-success") : "success"
      );
    }
  }, [points]);

  // Update points and options status when requested by container
  useEffect(() => {
    if (!reloadData) return;

    getTelemetry().then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
        setSelectedOption(telemetry.data.option);
      } else {
        setPoints(null);
        setSelectedOption(null);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  // Submit button click handler
  const handleClick = () => {
    // This shouldn't happen, but just in case
    if (selectedOption === null) return;

    let percentComplete = getOptionPointsFromLocalStorage(
      registryKey,
      selectedOption
    );
    setTelemetry(percentComplete, {
      option: selectedOption,
    }).then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
      }
    });
  };

  return (
    <div className="multiple-choice-exercise-container">
      <div dangerouslySetInnerHTML={{ __html: htmlBefore }} />

      <Options
        options={options}
        columns={columns}
        letterPosition={letterPosition}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        exerciseEnabled={exerciseEnabled}
      />

      <div dangerouslySetInnerHTML={{ __html: htmlAfter }} />

      <ExerciseSubmitButton
        onClick={handleClick}
        disabled={selectedOption === null || !exerciseEnabled}
      />
    </div>
  );
}
