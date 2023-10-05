import React, { useContext, useEffect, useState } from "react";
import type { ExerciseBaseProps } from "../../props";
import ExerciseContainer, {
  ExerciseContext,
} from "../../container/ExerciseContainer";
import ParsonsLineContainer from "./ParsonsLineContainer";
import ExerciseSubmitButton from "../../submit-button/ExerciseSubmitButton";
import Styles from "./styles.module.scss";
import {
  getAnswerPointsFromLocalStorage,
  loadAndRunPythonTests,
  splitLinesIntoAvailableAndSelected,
} from "./utils";
import type { ParsonsLineData } from "./parsons-types";
import {
  initializePython,
  registerPythonResultListener,
} from "../../../python-local-server/python-utils";
import type { TelemetryData } from "../../../../db/telemetry/model";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../../utils/translations";

const t = useTranslations(config.lang);

type InnerProps = {
  htmlBefore: string;
  htmlAfter: string;
  lines: ParsonsLineData[];
  registryKey: string;
  withIndentation: boolean;
  maxIndentation?: number | undefined;
  pythonTestsSrc?: string | undefined;
  singleColumn: boolean;
  slug: string;
};

type ParsonsExerciseProps = ExerciseBaseProps & InnerProps;

export default function ParsonsExercise({
  htmlBefore,
  htmlAfter,
  lines,
  withIndentation,
  maxIndentation,
  pythonTestsSrc,
  singleColumn,
  ...props
}: ParsonsExerciseProps) {
  const innerProps = {
    htmlBefore,
    htmlAfter,
    lines,
    withIndentation,
    maxIndentation,
    pythonTestsSrc,
    singleColumn,
  };
  return (
    <ExerciseContainer allowsEditing {...props}>
      <InnerComponent
        {...innerProps}
        registryKey={props.registryKey}
        slug={props.slug}
      />
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
  pythonTestsSrc,
  singleColumn,
  slug,
}: InnerProps) {
  const [studentAnswer, setStudentAnswer] = React.useState<string>("");

  const {
    reloadData,
    setReloadData,
    setPoints,
    setExtraAnswerContent,
    getTelemetry,
    setTelemetry,
    exerciseEnabled,
  } = useContext(ExerciseContext);

  const [availableLines, setAvailableLines] =
    useState<ParsonsLineData[]>(lines);
  const [selectedLines, setSelectedLines] = useState<ParsonsLineData[]>([]);

  useEffect(() => {
    if (pythonTestsSrc) {
      initializePython();
    }
  }, [pythonTestsSrc]);

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

        const newExtraAnswer = getExtraAnswer(telemetry);
        if (newExtraAnswer) {
          setExtraAnswerContent(newExtraAnswer);
        }
      } else {
        setPoints(null);
        setAvailableLines(lines);
        setSelectedLines([]);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  useEffect(() => {
    registerPythonResultListener(slug, (data: any) => {
      let percentComplete;
      const code = data.code;
      const totalTests = data.totalTests;
      const exception = data.exception;
      let passingTests = 0;
      if (data.success) {
        percentComplete = 100;
        passingTests = totalTests;
      } else if ((data.failures || data.errors) && totalTests) {
        passingTests =
          totalTests - (data.failures.size || 0) + (data.errors.size || 0);
        percentComplete = (100 * passingTests) / totalTests;
      } else {
        passingTests = 0;
        percentComplete = 0;
      }
      setTelemetry(percentComplete, {
        studentAnswer: code,
        totalTests,
        passingTests,
        exception,
      }).then((telemetry) => {
        if (telemetry) {
          setPoints(telemetry.percentComplete);

          const newExtraAnswer = getExtraAnswer(telemetry);
          if (newExtraAnswer) {
            setExtraAnswerContent(newExtraAnswer);
          }
        }
      });
    });
  }, []);

  const handleClick = () => {
    if (pythonTestsSrc) {
      loadAndRunPythonTests(slug, pythonTestsSrc, studentAnswer);
    } else {
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
    }
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

function getExtraAnswer(telemetry: TelemetryData) {
  const totalTests = telemetry.data.totalTests;
  const exception = telemetry.data.exception;

  if (exception) {
    return (
      <>
        <p>{t("parsons.exception")}</p>
        <pre className={Styles.exceptionText}>{exception}</pre>
      </>
    );
  }

  if (!totalTests) return null;
  return (
    <p>
      {t("parsons.passing-tests", {
        passingTests: telemetry.data.passingTests,
        totalTests,
        percentComplete: telemetry.percentComplete.toFixed(2),
      })}
    </p>
  );
}
