import React, { useContext, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer, {
  ExerciseContext,
} from "../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";

const t = useTranslations(config.lang);

type ProgressExerciseProps = Omit<ExerciseBaseProps, "tags">;

export const exerciseType = "progress";

export default function ProgressExercise({
  handoutPath,
  slug,
  exerciseNumber,
  latestSubmission,
  children,
}: ProgressExerciseProps) {
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
        initialDoneValue={latestSubmission?.data?.done}
      >
        {children}
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  handoutPath,
  slug,
  initialDoneValue,
  children,
}: {
  handoutPath: string;
  slug: string;
  initialDoneValue: boolean;
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(initialDoneValue || false);

  const { reloadData, setReloadData, setStatus } = useContext(ExerciseContext);

  useEffect(() => {
    setStatus(done ? "success" : "unanswered");
  }, [done]);

  useEffect(() => {
    if (!reloadData) return;

    fetchTelemetry(handoutPath, slug).then((telemetry) => {
      if (telemetry?.data?.done) {
        setDone(true);
      } else {
        setDone(false);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const handleClick = () => {
    postTelemetry(handoutPath, slug, exerciseType, 100, { done: true })
      .then(() => fetchTelemetry(handoutPath, slug))
      .then((telemetryData) => {
        setDone(telemetryData?.data?.done || false);
      });
  };

  return (
    <>
      {children}
      <div className={Styles.markDoneButtonContainer}>
        <Button onClick={handleClick} disabled={done}>
          {t("exercise.mark-done")}
        </Button>
      </div>
    </>
  );
}
