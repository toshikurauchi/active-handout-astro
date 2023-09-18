import React, { createContext, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../../utils/translations";
import Admonition from "../../admonition/ReactAdmonition";
import CorrectIcon from "../icons/CorrectIcon";
import PartiallyCorrectIcon from "../icons/PartiallyCorrectIcon";
import WrongIcon from "../icons/WrongIcon";
import Button from "../../button/ReactButton";
import Trash from "../../icons/Trash";
import type { ExerciseBaseProps, Status } from "../props";
import { clearTelemetry } from "../exercise-utils";
import AnswerReact from "../answer/AnswerReact";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";
import type { TelemetryData } from "../../../db/telemetry/model";

const t = useTranslations(config.lang);

export const ExerciseContext = createContext<{
  reloadData: boolean;
  setReloadData: React.Dispatch<React.SetStateAction<boolean>>;
  status: Status;
  exerciseEnabled: boolean;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  getTelemetry: () => Promise<TelemetryData | null | undefined>;
  setTelemetry: (
    percentComplete: number,
    data: any
  ) => Promise<TelemetryData | null | undefined>;
}>({
  reloadData: true,
  setReloadData: () => {},
  status: "unanswered",
  exerciseEnabled: true,
  setStatus: () => {},
  getTelemetry: async () => null,
  setTelemetry: async () => null,
});

export default function ExerciseContainer({
  exerciseNumber,
  handoutPath,
  slug,
  registryKey,
  exerciseData,
  latestSubmission,
  exerciseType,
  answerHTML,
  children,
}: ExerciseBaseProps) {
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

  useEffect(() => {
    if (exerciseData) {
      localStorage.setItem(registryKey, JSON.stringify(exerciseData));
    }
  }, [exerciseData]);

  const getTelemetry = () => {
    return fetchTelemetry(handoutPath, slug);
  };

  const setTelemetry = async (percentComplete: number, data: any) => {
    return postTelemetry(
      handoutPath,
      slug,
      exerciseType,
      percentComplete,
      data
    ).then(() => fetchTelemetry(handoutPath, slug));
  };

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
            {status === "partial-success" && (
              <PartiallyCorrectIcon
                className={`${Styles.icon} ${Styles.partiallyCorrectIcon}`}
              />
            )}
            {status === "failed" && (
              <WrongIcon className={`${Styles.icon} ${Styles.wrongIcon}`} />
            )}
          </>
        )
      }
    >
      <ExerciseContext.Provider
        value={{
          reloadData,
          setReloadData,
          status,
          exerciseEnabled: status === "unanswered",
          setStatus,
          getTelemetry,
          setTelemetry,
        }}
      >
        {children}
      </ExerciseContext.Provider>

      {answerHTML && (
        <AnswerReact
          answerHTML={answerHTML}
          visible={status !== "unanswered"}
          status={status}
        />
      )}
    </Admonition>
  );
}
