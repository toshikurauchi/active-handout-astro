import React, { useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer from "../ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import {
  dispatchAddTelemetry,
  dispatchRetrieveTelemetry,
} from "../telemetry/custom-events";

const t = useTranslations(config.lang);

type ProgressExerciseProps = ExerciseBaseProps;

const EXERCISE_TYPE = "progress";

export default function ProgressExercise({
  pageId,
  slug,
  exerciseNumber,
  tags = [],
  children,
}: ProgressExerciseProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.addEventListener("RetrievedTelemetry", (event) => {
      const { detail } = event;
      if (detail.pageId === pageId && detail.slug === slug) {
        setDone(true);
      }
    });

    dispatchRetrieveTelemetry(pageId, slug);
  }, []);

  tags.push("progress-exercise");

  const handleClick = () => {
    dispatchAddTelemetry(pageId, slug, EXERCISE_TYPE, 100, { done: true });
    setDone(true);
  };

  return (
    <ExerciseContainer
      pageId={pageId}
      slug={slug}
      tags={tags}
      exerciseNumber={exerciseNumber}
      status={done ? "success" : "unanswered"}
    >
      {children}
      <div className={Styles.markDoneButtonContainer}>
        <Button onClick={handleClick} disabled={done}>
          {t("exercise.mark-done")}
        </Button>
      </div>
    </ExerciseContainer>
  );
}
