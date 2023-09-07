import React, { useRef } from "react";
import Styles from "./styles.module.scss";
import { useTranslations } from "../../../utils/translations";
import config from "virtual:active-handout/user-config";
import { dispatchClearOptionsEvent } from "./events";
import { getContainer } from "./dom-utils";

const t = useTranslations(config.lang);

type OptionsProps = {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  children: React.ReactNode;
};

export default function Options({ columns, children }: OptionsProps) {
  const optionsRef = useRef<HTMLDivElement>(null);

  if (!columns) columns = 1;

  const handleClearSelectionClick = () => {
    if (optionsRef.current) {
      dispatchClearOptionsEvent(getContainer(optionsRef.current), -1);
    }
  };

  const className = `multiple-choice-options ${Styles.optionList} ${
    Styles[`options--${columns}-cols`]
  }`;

  return (
    <>
      <div className={className} ref={optionsRef}>
        {children}
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
