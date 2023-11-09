import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../../utils/translations";
import Admonition from "../../admonition/ReactAdmonition";
import CorrectIcon from "../../icons/CorrectIcon";
import PartiallyCorrectIcon from "../../icons/PartiallyCorrectIcon";
import WrongIcon from "../../icons/WrongIcon";
import Button from "../../button/ReactButton";
import Trash from "../../icons/Trash";
import type { ExerciseBaseProps, Status } from "../props";
import { clearTelemetry } from "../exercise-utils";
import AnswerReact from "../answer/AnswerReact";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";
import type { TelemetryData } from "../../../db/telemetry/model";
import Edit from "../../icons/Edit";

const t = useTranslations(config.lang);

export const ExerciseContext = createContext<{
  reloadData: boolean;
  setReloadData: React.Dispatch<React.SetStateAction<boolean>>;
  status: Status;
  exerciseEnabled: boolean;
  points: number | null;
  setPoints: React.Dispatch<React.SetStateAction<number | null>>;
  extraAnswerContent: ReactNode;
  setExtraAnswerContent: React.Dispatch<React.SetStateAction<ReactNode>>;
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
  points: 0,
  setPoints: () => {},
  extraAnswerContent: null,
  setExtraAnswerContent: () => {},
  getTelemetry: async () => null,
  setTelemetry: async () => null,
});

export default function ExerciseContainer({
  handoutPath,
  slug,
  registryKey,
  exerciseData,
  latestSubmission,
  exerciseType,
  answerHTML,
  answerTitleRight,
  allowsEditing,
  children,
}: ExerciseBaseProps) {
  // Start reloading data as soon as the component is mounted
  const [reloadData, setReloadData] = useState(true);
  const initialStatus = !latestSubmission
    ? "unanswered"
    : pointsToStatus(latestSubmission.percentComplete);
  const [status, setStatus] = useState<Status>(initialStatus);
  const initialPoints = latestSubmission?.percentComplete;
  const [points, setPoints] = useState<number | null>(
    typeof initialPoints === "undefined" ? null : initialPoints
  );
  const [extraAnswerContent, setExtraAnswerContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (points === null) {
      setStatus("unanswered");
    } else {
      setStatus(pointsToStatus(points));
    }
  }, [points]);

  const handleClearExercise = () => {
    clearTelemetry(handoutPath, slug).then(() => {
      setReloadData(true);
    });
  };

  const handleEditAnswer = () => {
    setStatus("unanswered");
    setPoints(null);
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

  const exerciseEnabled = status === "unanswered";

  return (
    <Admonition
      title={`${t("exercise.title")}`}
      hasCounter
      type={status === "unanswered" ? "exercise" : "quote"}
      renderTitleRight={() =>
        status === "unanswered" ? null : (
          <>
            {allowsEditing && !exerciseEnabled && (
              <Button
                transparent
                onClick={handleEditAnswer}
                tooltip={t("msg.exercise-edit")}
              >
                <Edit className={`${Styles.icon} ${Styles.actionIcon}`} />
              </Button>
            )}
            <Button
              transparent
              onClick={handleClearExercise}
              tooltip={t("msg.exercise-clear")}
            >
              <Trash className={`${Styles.icon} ${Styles.actionIcon}`} />
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
          exerciseEnabled,
          points,
          setPoints,
          extraAnswerContent,
          setExtraAnswerContent,
          getTelemetry,
          setTelemetry,
        }}
      >
        {children}
      </ExerciseContext.Provider>

      {(answerHTML || extraAnswerContent) && (
        <AnswerReact
          answerHTML={answerHTML || ""}
          extraAnswerContent={extraAnswerContent}
          answerTitleRight={answerTitleRight}
          visible={status !== "unanswered"}
          status={status}
        />
      )}
    </Admonition>
  );
}

function pointsToStatus(points: number | null): Status {
  if (points === null) return "unanswered";
  return points < 100
    ? points < 10
      ? "failed"
      : "partial-success"
    : "success";
}
