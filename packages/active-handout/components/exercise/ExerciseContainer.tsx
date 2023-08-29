import React from "react";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../utils/translations";
import Admonition from "../admonition/ReactAdmonition";
import CorrectIcon from "./icons/CorrectIcon";
import WrongIcon from "./icons/WrongIcon";
import Button from "../button/ReactButton";
import Trash from "../icons/Trash";
import { dispatchClearTelemetry } from "./telemetry/custom-events";
import type { ExerciseBaseProps } from "./props";

type ExerciseContainerProps = {
  status: "unanswered" | "success" | "failed";
} & ExerciseBaseProps;

const t = useTranslations(config.lang);

export default function ExerciseContainer({
  exerciseNumber,
  pageId,
  slug,
  status,
  children,
}: ExerciseContainerProps) {
  const handleClearExercise = () => {
    dispatchClearTelemetry(pageId, slug);
  };

  return (
    <Admonition
      title={`${t("exercise.title")} ${exerciseNumber}`}
      type={status === "unanswered" ? "exercise" : "quote"}
      renderTitleRight={() =>
        status === "unanswered" ? null : (
          <>
            <Button transparent onClick={handleClearExercise}>
              <Trash className={Styles.icon} />
            </Button>
            {status === "success" && (
              <CorrectIcon className={`${Styles.icon} ${Styles.correctIcon}`} />
            )}
            {status === "failed" && (
              <WrongIcon className={`${Styles.icon} ${Styles.wrongIcon}`} />
            )}
          </>
        )
      }
    >
      {children}
    </Admonition>
  );
}
