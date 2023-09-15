import React, { createContext, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../../utils/translations";
import Admonition from "../../admonition/ReactAdmonition";
import CorrectIcon from "../icons/CorrectIcon";
import WrongIcon from "../icons/WrongIcon";
import Button from "../../button/ReactButton";
import Trash from "../../icons/Trash";
import type { ExerciseBaseProps, Status } from "../props";
import { clearTelemetry } from "../exercise-utils";

type ExerciseContainerProps = Omit<ExerciseBaseProps, "tags">;

const t = useTranslations(config.lang);

export const ExerciseContext = createContext<{
  reloadData: boolean;
  setReloadData: React.Dispatch<React.SetStateAction<boolean>>;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}>({
  reloadData: true,
  setReloadData: () => {},
  status: "unanswered",
  setStatus: () => {},
});

export default function ExerciseContainer({
  exerciseNumber,
  handoutPath,
  slug,
  latestSubmission,
  children,
}: ExerciseContainerProps) {
  // Start reloading data as soon as the component is mounted
  const [reloadData, setReloadData] = useState(true);
  const initialStatus = !latestSubmission
    ? "unanswered"
    : latestSubmission.percentComplete > 99.9
    ? "success"
    : "failed";
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleClearExercise = () => {
    clearTelemetry(handoutPath, slug).then(() => {
      setReloadData(true);
    });
  };

  useEffect(() => {
    document.addEventListener("ClearTelemetry", () => {
      handleClearExercise();
    });
  }, []);

  return (
    <Admonition
      title={`${t("exercise.title")} ${exerciseNumber}`}
      type={status === "unanswered" ? "exercise" : "quote"}
      renderTitleRight={() =>
        status === "unanswered" ? null : (
          <>
            <Button
              transparent
              onClick={handleClearExercise}
              tooltip={t("msg.exercise-clear")}
            >
              <Trash className={`${Styles.icon} ${Styles.trashIcon}`} />
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
      <ExerciseContext.Provider
        value={{ reloadData, setReloadData, status, setStatus }}
      >
        {children}
      </ExerciseContext.Provider>
    </Admonition>
  );
}
