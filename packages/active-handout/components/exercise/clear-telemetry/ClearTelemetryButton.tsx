import React from "react";
import config from "virtual:active-handout/user-config";
import Trash from "../../icons/Trash";
import Styles from "./styles.module.scss";
import Button from "../../button/ReactButton";
import { dispatchNotification } from "../../notifier/custom-events";
import { useTranslations } from "../../../utils/translations";
import { dispatchClearTelemetry } from "../telemetry/custom-events";

const t = useTranslations(config.lang);

export default function ClearTelemetryButton() {
  const handleClearExercise = () => {
    dispatchClearTelemetry();
    dispatchNotification(t("msg.all-exercise-cleared"));
  };

  return (
    <Button
      transparent
      onClick={handleClearExercise}
      tooltip={t("msg.all-exercise-clear")}
    >
      <Trash className={Styles.icon} />
    </Button>
  );
}
