import React from "react";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../utils/translations";
import Admonition from "../admonition/ReactAdmonition";
import CorrectIcon from "./icons/CorrectIcon";
import WrongIcon from "./icons/WrongIcon";

type ExerciseContainerProps = {
  exerciseNumber: number;
  status: "unanswered" | "success" | "failed";
  children: React.ReactNode;
};

const t = useTranslations(config.lang);

export default function ExerciseContainer({
  exerciseNumber,
  status,
  children,
}: ExerciseContainerProps) {
  return (
    <Admonition
      title={`${t("exercise.title")} ${exerciseNumber}`}
      type={status === "unanswered" ? "exercise" : "quote"}
      renderTitleRight={() =>
        status === "unanswered" ? null : status === "success" ? (
          <CorrectIcon className={Styles.correctIcon} />
        ) : (
          <WrongIcon className={Styles.wrongIcon} />
        )
      }
    >
      {children}
    </Admonition>
  );
}
