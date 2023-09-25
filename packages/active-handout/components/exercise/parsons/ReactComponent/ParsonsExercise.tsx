import React, { useContext, useEffect, useState } from "react";
import type { ExerciseBaseProps } from "../../props";
import ExerciseContainer, {
  ExerciseContext,
} from "../../container/ExerciseContainer";
import ParsonsLineContainer from "./ParsonsLineContainer";
import ExerciseSubmitButton from "../../submit-button/ExerciseSubmitButton";
import { getAnswerPointsFromLocalStorage } from "./utils";
import type { ParsonsLineData } from "./parsons-types";
import { INDENTATION } from "../indentation";

type InnerProps = {
  htmlBefore: string;
  htmlAfter: string;
  lines: ParsonsLineData[];
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
  withIndentation,
  maxIndentation,
  singleColumn,
  ...props
}: ParsonsExerciseProps) {
  const innerProps = {
    htmlBefore,
    htmlAfter,
    lines,
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

  const [availableLines, setAvailableLines] =
    useState<ParsonsLineData[]>(lines);
  const [selectedLines, setSelectedLines] = useState<ParsonsLineData[]>([]);

  // Update points and options status when requested by container
  useEffect(() => {
    if (!reloadData) return;

    getTelemetry().then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
        const [newAvailableLines, newSelectedLines] =
          splitLinesIntoAvailableAndSelected(
            lines,
            telemetry.data.studentAnswer
          );
        setAvailableLines(newAvailableLines);
        setSelectedLines(newSelectedLines);
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
        availableLines={availableLines}
        selectedLines={selectedLines}
        withIndentation={withIndentation}
        maxIndentation={maxIndentation || 5}
        singleColumn={singleColumn}
        onAnswerChanged={setStudentAnswer}
        disabled={!exerciseEnabled}
      />

      {htmlAfter && <div dangerouslySetInnerHTML={{ __html: htmlAfter }} />}

      <ExerciseSubmitButton onClick={handleClick} disabled={!exerciseEnabled} />
    </div>
  );
}

function splitLinesIntoAvailableAndSelected(
  lines: ParsonsLineData[],
  studentAnswer: string
): [ParsonsLineData[], ParsonsLineData[]] {
  let newAvailableLines: ParsonsLineData[] = [...lines];
  const newSelectedLines: ParsonsLineData[] = [];

  for (const targetLineWithIndent of studentAnswer.split("\n")) {
    const indent = countIndentation(targetLineWithIndent);
    const targetLine = targetLineWithIndent.trim();
    const filteredAvailableLines = [];
    let found = false;
    for (const line of newAvailableLines) {
      if (!found && targetLine === line.plainContent) {
        newSelectedLines.push({ ...line, indent });
      } else {
        filteredAvailableLines.push(line);
      }
    }
    newAvailableLines = filteredAvailableLines;
  }

  return [newAvailableLines, newSelectedLines];
}

function countIndentation(line: string): number {
  let spaces = 0;
  for (const c of line) {
    if (c === " ") {
      spaces++;
    } else {
      break;
    }
  }
  return spaces / INDENTATION.length;
}
