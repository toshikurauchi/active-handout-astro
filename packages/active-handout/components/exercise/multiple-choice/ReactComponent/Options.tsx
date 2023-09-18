import React, { useEffect, useState } from "react";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../../utils/translations";
import Styles from "./styles.module.scss";
import Option from "./Option";
import type { Option as OptionData } from "../rehype-extract-options";
import type { ColumnCount, LetterPosition } from "./props";

const t = useTranslations(config.lang);

type OptionsProps = {
  options: OptionData[];
  columns: ColumnCount;
  letterPosition: LetterPosition;
  selectedOption: number | null;
  setSelectedOption: (option: number | null) => void;
  exerciseEnabled: boolean;
};

export default function Options({
  options,
  columns,
  letterPosition,
  selectedOption,
  setSelectedOption,
  exerciseEnabled,
}: OptionsProps) {
  const [optionsStatus, setOptionsStatus] = useState<boolean[]>(
    buildOptionsStatus(options, selectedOption ?? -1)
  );

  const optionsClassName = buildOptionsClassName(columns, letterPosition);

  const buildOptionClickHandler = (index: number) => {
    return () => {
      setSelectedOption(index);
      setOptionsStatus((optionsStatus) =>
        optionsStatus.map((_, idx) => idx === index)
      );
    };
  };

  const handleClearSelectionClick = () => {
    if (exerciseEnabled) {
      setOptionsStatus(buildOptionsStatus(options, -1));
    }
  };

  useEffect(() => {
    if (selectedOption === null) {
      setOptionsStatus(buildOptionsStatus(options, -1));
    } else {
      setOptionsStatus(buildOptionsStatus(options, selectedOption));
    }
  }, [selectedOption]);

  return (
    <>
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
    </>
  );
}

function buildOptionsClassName(
  columns: ColumnCount,
  letterPosition: LetterPosition
) {
  return `${Styles.optionList} ${Styles[`options--${columns}-cols`]} ${
    letterPosition === "top"
      ? Styles.optionsLetterTop
      : letterPosition === "left"
      ? Styles.optionsLetterLeft
      : Styles.optionsLetterNone
  }`;
}

function buildOptionsStatus(
  options: OptionData[],
  selectedOption: number | undefined
) {
  return options.map((_, idx) => idx === selectedOption);
}
