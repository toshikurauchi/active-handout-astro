import React, { useContext, useEffect, useRef, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer, {
  ExerciseContext,
} from "../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";
import {
  CLEAR_OPTIONS_EVENT,
  OPTION_SELECTED_EVENT,
  dispatchOptionSelected,
} from "./events";

const t = useTranslations(config.lang);

type MultipleChoiceExerciseProps = Omit<ExerciseBaseProps, "tags"> & {
  registryKey: string;
};

export const exerciseType = "multiple-choice";

export default function MultipleChoiceExercise({
  handoutPath,
  slug,
  exerciseNumber,
  latestSubmission,
  registryKey,
  children,
}: MultipleChoiceExerciseProps) {
  return (
    <ExerciseContainer
      handoutPath={handoutPath}
      slug={slug}
      latestSubmission={latestSubmission}
      exerciseNumber={exerciseNumber}
    >
      <InnerComponent
        handoutPath={handoutPath}
        slug={slug}
        initialOptionValue={latestSubmission?.data?.option}
        registryKey={registryKey}
      >
        {children}
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  handoutPath,
  slug,
  initialOptionValue,
  registryKey,
  children,
}: {
  handoutPath: string;
  slug: string;
  initialOptionValue: number | undefined;
  registryKey: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    initialOptionValue || null
  );
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener(OPTION_SELECTED_EVENT, (event) => {
      setSelectedOption((event as CustomEvent).detail.index);
    });

    containerRef.current.addEventListener(CLEAR_OPTIONS_EVENT, () => {
      setSelectedOption(null);
    });
  }, [containerRef.current]);

  useEffect(() => {
    setStatus(
      points === null ? "unanswered" : points < 100 ? "failed" : "success"
    );
  }, [points]);

  const { reloadData, setReloadData, setStatus } = useContext(ExerciseContext);

  useEffect(() => {
    if (!reloadData) return;

    fetchTelemetry(handoutPath, slug).then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
        dispatchOptionSelected(containerRef.current!, telemetry.data.option);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const handleClick = () => {
    const options = localStorage.getItem(registryKey);
    let percentComplete = -1;
    if (options && selectedOption !== null) {
      const parsedOptions = JSON.parse(options);
      const optionData = parsedOptions?.[selectedOption];
      if (optionData) {
        percentComplete = optionData.correct ? 100 : 0;
      }
    }
    postTelemetry(handoutPath, slug, exerciseType, percentComplete, {
      option: selectedOption,
    })
      .then(() => fetchTelemetry(handoutPath, slug))
      .then((telemetry) => {
        if (telemetry) {
          setPoints(telemetry.percentComplete);
        }
      });
  };

  return (
    <div className="multiple-choice-exercise-container" ref={containerRef}>
      {children}
      <div className={Styles.submitBtnContainer}>
        <Button onClick={handleClick} disabled={selectedOption === null}>
          {t("msg.submit")}
        </Button>
      </div>
    </div>
  );
}
