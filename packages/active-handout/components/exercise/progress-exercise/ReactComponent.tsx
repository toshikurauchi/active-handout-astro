import React, { useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer from "../ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";

const t = useTranslations(config.lang);

type ProgressExerciseProps = {
  slug: string;
  tags?: string[];
} & ExerciseBaseProps;

export default function ProgressExercise({
  slug,
  exerciseNumber,
  tags = [],
  children,
}: ProgressExerciseProps) {
  const [done, setDone] = useState(false);

  tags.push("progress-exercise");

  const handleClick = () => {
    setDone((done) => !done);
  };

  return (
    <ExerciseContainer
      exerciseNumber={exerciseNumber}
      status={done ? "success" : "unanswered"}
    >
      {children}
      <div className={Styles.markDoneButtonContainer}>
        <Button onClick={handleClick}>{t("exercise.mark-done")}</Button>
      </div>
    </ExerciseContainer>
  );
}
