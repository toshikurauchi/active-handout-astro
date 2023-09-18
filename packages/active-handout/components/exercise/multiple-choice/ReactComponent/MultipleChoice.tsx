import React, { useContext, useEffect, useRef, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../../utils/translations";
import Button from "../../../button/ReactButton";
import ExerciseContainer, {
  ExerciseContext,
} from "../../container/ExerciseContainer";
import type { ExerciseBaseProps } from "../../props";
import Styles from "./styles.module.scss";
import { fetchTelemetry, postTelemetry } from "../../exercise-utils";
import type { Option as OptionData } from "../rehype-extract-options";
import Option from "./Option";
import { getOptionPointsFromLocalStorage } from "./utils";
import AnswerReact from "../../answer/AnswerReact";

const t = useTranslations(config.lang);

export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type LetterPosition = "top" | "left" | null;

type MultipleChoiceExerciseProps = Omit<ExerciseBaseProps, "tags"> & {
  registryKey: string;
  htmlBefore: string;
  htmlAfter: string;
  answerHTML: string;
  options: OptionData[];
  columns: ColumnCount;
  letterPosition: LetterPosition;
};

export const exerciseType = "multiple-choice";

export default function MultipleChoiceExercise({
  handoutPath,
  slug,
  exerciseNumber,
  latestSubmission,
  registryKey,
  htmlBefore,
  htmlAfter,
  answerHTML,
  options,
  columns,
  letterPosition,
}: MultipleChoiceExerciseProps) {
  return (
    <ExerciseContainer
      handoutPath={handoutPath}
      slug={slug}
      latestSubmission={latestSubmission}
      exerciseNumber={exerciseNumber}
      answerHTML={answerHTML}
    >
      <InnerComponent
        handoutPath={handoutPath}
        slug={slug}
        initialSelectedOption={latestSubmission?.data?.option}
        initialPoints={latestSubmission?.percentComplete}
        registryKey={registryKey}
        htmlBefore={htmlBefore}
        htmlAfter={htmlAfter}
        answerHTML={answerHTML}
        options={options}
        columns={columns}
        letterPosition={letterPosition}
      />
    </ExerciseContainer>
  );
}

function buildOptionsStatus(
  options: OptionData[],
  selectedOption: number | undefined
) {
  return options.map((_, idx) => idx === selectedOption);
}

function InnerComponent({
  handoutPath,
  slug,
  initialSelectedOption,
  initialPoints,
  registryKey,
  htmlBefore,
  htmlAfter,
  answerHTML,
  options,
  columns,
  letterPosition,
}: {
  handoutPath: string;
  slug: string;
  initialSelectedOption: number | undefined;
  initialPoints: number | undefined;
  registryKey: string;
  htmlBefore: string;
  htmlAfter: string;
  answerHTML: string;
  options: OptionData[];
  columns: ColumnCount;
  letterPosition: LetterPosition;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [optionsStatus, setOptionsStatus] = useState<boolean[]>(
    buildOptionsStatus(options, initialSelectedOption)
  );
  const [points, setPoints] = useState<number | null>(
    typeof initialPoints === "undefined" ? null : initialPoints
  );
  const [exerciseEnabled, setExerciseEnabled] = useState(true);
  const { reloadData, setReloadData, status, setStatus } =
    useContext(ExerciseContext);

  useEffect(() => {
    if (points === null) {
      setStatus("unanswered");
      setExerciseEnabled(true);
    } else {
      setStatus(
        points < 100 ? (points < 10 ? "failed" : "partial-success") : "success"
      );
      setExerciseEnabled(false);
    }
  }, [points]);

  useEffect(() => {
    if (!reloadData) return;

    fetchTelemetry(handoutPath, slug).then((telemetry) => {
      if (telemetry) {
        setPoints(telemetry.percentComplete);
        setOptionsStatus(buildOptionsStatus(options, telemetry.data.option));
      } else {
        setPoints(null);
        setOptionsStatus(buildOptionsStatus(options, -1));
      }

      setReloadData(false);
    });
  }, [reloadData]);

  const selectedOption = optionsStatus.findIndex((status) => status);
  const handleClick = () => {
    // This shouldn't happen, but just in case
    if (selectedOption === -1) return;

    let percentComplete = getOptionPointsFromLocalStorage(
      registryKey,
      selectedOption
    );
    postTelemetry(handoutPath, slug, exerciseType, percentComplete, {
      option: selectedOption,
    })
      .then(() => fetchTelemetry(handoutPath, slug))
      .then((telemetry) => {
        if (telemetry) {
          setPoints(telemetry.percentComplete);
        }
      });
  };

  const handleClearSelectionClick = () => {
    if (exerciseEnabled) {
      setOptionsStatus(buildOptionsStatus(options, -1));
    }
  };

  const optionsClassName = `${Styles.optionList} ${
    Styles[`options--${columns}-cols`]
  } ${
    letterPosition === "top"
      ? Styles.optionsLetterTop
      : letterPosition === "left"
      ? Styles.optionsLetterLeft
      : Styles.optionsLetterNone
  }`;

  const buildOptionClickHandler = (index: number) => {
    return () => {
      setOptionsStatus((optionsStatus) =>
        optionsStatus.map((_, idx) => idx === index)
      );
    };
  };

  return (
    <div className="multiple-choice-exercise-container" ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: htmlBefore }} />

      <div className={optionsClassName}>
        {options.map((option, idx) => (
          <Option
            key={`option--${idx}`}
            html={option.htmlContent}
            onClick={buildOptionClickHandler(idx)}
            disabled={!exerciseEnabled}
            selected={optionsStatus[idx] as boolean}
          />
        ))}
      </div>
      <div className={Styles.clearSelectionBtnContainer}>
        <button
          className={Styles.clearSelectionBtn}
          onClick={handleClearSelectionClick}
        >
          {t("msg.clear-selection")}
        </button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: htmlAfter }} />

      <div className={Styles.submitBtnContainer}>
        <Button
          onClick={handleClick}
          disabled={selectedOption < 0 || !exerciseEnabled}
        >
          {t("msg.submit")}
        </Button>
      </div>

      <AnswerReact
        answerHTML={answerHTML}
        visible={!exerciseEnabled}
        status={status}
      />
    </div>
  );
}
