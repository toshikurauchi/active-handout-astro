import React from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../utils/translations";
import Admonition from "../admonition/ReactAdmonition";

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
      type={
        status === "unanswered"
          ? "exercise"
          : status === "success"
          ? "success"
          : "danger"
      }
    >
      {children}
    </Admonition>
  );
}
