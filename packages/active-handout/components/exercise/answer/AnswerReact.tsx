import React from "react";
import Styles from "./styles.module.scss";
import type { Status } from "../props";

type AnswerReactProps = {
  answerHTML: string;
  visible: boolean;
  status: Status;
};

export default function AnswerReact({
  answerHTML,
  visible,
  status,
}: AnswerReactProps) {
  if (!visible) return null;

  const className = `${Styles.exerciseAnswer} ${classForStatus(status)}`.trim();
  return (
    <div className={className}>
      <div className={Styles.exerciseAnswerTitle}>Answer</div>
      <div dangerouslySetInnerHTML={{ __html: answerHTML }} />
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
