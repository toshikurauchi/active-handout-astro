import React, { useContext, useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer, {
  ExerciseContext,
} from "../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";

const t = useTranslations(config.lang);

export const exerciseType = "progress";

export default function ProgressExercise(props: ExerciseBaseProps) {
  return (
    <ExerciseContainer {...props}>
      <InnerComponent {...props}>
        <div dangerouslySetInnerHTML={{ __html: props.baseHTML }} />
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  latestSubmission,
  children,
}: ExerciseBaseProps & { children: React.ReactNode }) {
  const [done, setDone] = useState(latestSubmission?.data?.done || false);

  const { reloadData, setReloadData, setPoints, getTelemetry, setTelemetry } =
    useContext(ExerciseContext);

  useEffect(() => {
    setPoints(done ? 100 : null);
  }, [done]);

  useEffect(() => {
    if (!reloadData) return;

    getTelemetry().then((telemetry) => {
      if (telemetry?.data?.done) {
        setDone(true);
      } else {
        setDone(false);
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const handleClick = () => {
    setTelemetry(100, { done: true }).then((telemetryData) => {
      setDone(telemetryData?.data?.done || false);
    });
  };

  return (
    <>
      {children}
      <div className={Styles.markDoneButtonContainer}>
        <Button onClick={handleClick} disabled={done}>
          {t("exercise.mark-done")}
        </Button>
      </div>
    </>
  );
}
