import React from "react";
import Button from "../../button/ReactButton";
import { useTranslations } from "../../../utils/translations";
import config from "virtual:active-handout/user-config";
import Styles from "./styles.module.scss";
import LoadingIcon from "../../icons/LoadingIcon";

type ExerciseSubmitButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: React.ReactNode;
  loading?: boolean;
};

export default function ExerciseSubmitButton({
  onClick,
  disabled,
  loading,
  children,
}: ExerciseSubmitButtonProps) {
  const t = useTranslations(config.lang);

  return (
    <div className={Styles.submitBtnContainer}>
      <Button onClick={onClick} disabled={disabled || loading}>
        {loading && (
          <div className={Styles.loadingIcon}>
            <LoadingIcon />
          </div>
        )}
        {children || t("msg.submit")}
      </Button>
    </div>
  );
}
