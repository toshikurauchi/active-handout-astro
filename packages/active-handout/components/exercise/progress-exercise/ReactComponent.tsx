import React, { useContext, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer, { ExerciseContext } from "../ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";

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
  tags.push("progress-exercise");

  return (
    <ExerciseContainer
      pageId={pageId}
      slug={slug}
      tags={tags}
      exerciseNumber={exerciseNumber}
    >
      <InnerComponent pageId={pageId} slug={slug}>
        {children}
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  pageId,
  slug,
  children,
}: {
  pageId: string;
  slug: string;
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setStatus(done ? "success" : "unanswered");
  }, [done]);

  const { reloadData, setReloadData, setStatus } = useContext(ExerciseContext);

  useEffect(() => {
    if (!reloadData) return;

    const telemetry = fetchTelemetry(pageId, slug);
    if (telemetry?.meta.pageId === pageId && telemetry?.meta.slug === slug) {
      setDone(true);
    } else {
      setDone(false);
    }

    setReloadData(false);
  }, [reloadData]);

  const handleClick = () => {
    postTelemetry(pageId, slug, EXERCISE_TYPE, 100, { done: true });
    setDone(true);
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
