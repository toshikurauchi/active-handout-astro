import React, { useContext, useEffect, useRef, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../utils/translations";
import Button from "../../button/ReactButton";
import ExerciseContainer, {
  ExerciseContext,
} from "../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../props";
import Styles from "./styles.module.scss";
import { fetchTelemetry, postTelemetry } from "../exercise-utils";
import { CLEAR_OPTIONS_EVENT, OPTION_SELECTED_EVENT } from "./events";

const t = useTranslations(config.lang);

type MultipleChoiceExerciseProps = Omit<ExerciseBaseProps, "tags">;

export const exerciseType = "multiple-choice";

export default function MultipleChoiceExercise({
  pageId,
  slug,
  exerciseNumber,
  latestSubmission,
  children,
}: MultipleChoiceExerciseProps) {
  return (
    <ExerciseContainer
      pageId={pageId}
      slug={slug}
      latestSubmission={latestSubmission}
      exerciseNumber={exerciseNumber}
    >
      <InnerComponent
        pageId={pageId}
        slug={slug}
        initialOptionValue={latestSubmission?.data?.option}
      >
        {children}
      </InnerComponent>
    </ExerciseContainer>
  );
}

function InnerComponent({
  pageId,
  slug,
  initialOptionValue,
  children,
}: {
  pageId: string;
  slug: string;
  initialOptionValue: string | undefined;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState(
    initialOptionValue || null
  );

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener(OPTION_SELECTED_EVENT, (event) => {
      setSelectedOption((event as CustomEvent).detail.index);
    });

    containerRef.current.addEventListener(CLEAR_OPTIONS_EVENT, () => {
      setSelectedOption(null);
    });
  }, [containerRef.current]);

  // useEffect(() => {
  //   setStatus(done ? "success" : "unanswered");
  // }, [done]);

  const { reloadData, setReloadData, setStatus } = useContext(ExerciseContext);

  useEffect(() => {
    if (!reloadData) return;

    fetchTelemetry(pageId, slug).then((telemetry) => {
      // if (telemetry?.data?.done) {
      //   setDone(true);
      // } else {
      //   setDone(false);
      // }

      setReloadData(false);
    });
  }, [reloadData]);

  // const handleClick = () => {
  //   postTelemetry(pageId, slug, exerciseType, 100, { done: true }).then(() => {
  //     setDone(true);
  //   });
  // };

  return (
    <div className="multiple-choice-exercise-container" ref={containerRef}>
      {children}
      <div className={Styles.submitBtnContainer}>
        <Button disabled={selectedOption === null}>{t("msg.submit")}</Button>
      </div>
    </div>
  );
}
