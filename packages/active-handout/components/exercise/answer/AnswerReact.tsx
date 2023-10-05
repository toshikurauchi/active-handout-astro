import React, { type ReactNode } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Styles from "./styles.module.scss";
import type { Status } from "../props";

const t = useTranslations(config.lang);

type AnswerReactProps = {
  answerHTML: string;
  extraAnswerContent?: ReactNode;
  visible: boolean;
  status: Status;
};

export default function AnswerReact({
  answerHTML,
  extraAnswerContent,
  visible,
  status,
}: AnswerReactProps) {
  if (!visible) return null;

  const className = `${Styles.exerciseAnswer} ${classForStatus(status)}`.trim();
  return (
    <div className={className}>
      <div className={Styles.exerciseAnswerTitle}>{t("msg.answer")}</div>
      {answerHTML && <div dangerouslySetInnerHTML={{ __html: answerHTML }} />}
      {extraAnswerContent && <div>{extraAnswerContent}</div>}
    </div>
  );
}

function classForStatus(status: Status) {
  switch (status) {
    case "success":
      return Styles.correct;
    case "partial-success":
      return Styles.partiallyCorrect;
    case "failed":
      return Styles.wrong;
    default:
      return "";
  }
}
