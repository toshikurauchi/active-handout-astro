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
  pageId,
  slug,
  exerciseNumber,
  latestSubmission,
  children,
}: ProgressExerciseProps) {
  return (
    <ExerciseContainer
      pageId={pageId}
      slug={slug}
      latestSubmission={latestSubmission}
      exerciseNumber={exerciseNumber}
    >
      <InnerComponent
        pageId={pageId}
        slug={slug}
        initialDoneValue={latestSubmission?.data?.done}
      >
        {children}
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  pageId,
  slug,
  initialDoneValue,
  children,
}: {
  pageId: string;
  slug: string;
  initialDoneValue: boolean;
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(initialDoneValue || false);

  useEffect(() => {
    setStatus(done ? "success" : "unanswered");
  }, [done]);

  const { reloadData, setReloadData, setStatus } = useContext(ExerciseContext);

  useEffect(() => {
    if (!reloadData) return;

    fetchTelemetry(pageId, slug).then((telemetry) => {
      if (telemetry?.data?.done) {
        setDone(true);
      } else {
        setDone(false);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const handleClick = () => {
    postTelemetry(pageId, slug, exerciseType, 100, { done: true }).then(() => {
      setDone(true);
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
