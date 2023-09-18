import React from "react";
import Button from "../../button/ReactButton";
import { useTranslations } from "../../../utils/translations";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";

export default function ExerciseSubmitButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const t = useTranslations(config.lang);

  return (
    <div className={Styles.submitBtnContainer}>
      <Button onClick={onClick} disabled={disabled}>
        {t("msg.submit")}
      </Button>
    </div>
  );
}
