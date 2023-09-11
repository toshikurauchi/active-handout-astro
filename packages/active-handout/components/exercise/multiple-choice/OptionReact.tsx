import React, { useEffect, useRef, useState } from "react";
import Styles from "./styles.module.scss";
import {
  CLEAR_OPTIONS_EVENT,
  dispatchClearOptionsEvent,
  dispatchOptionSelected,
} from "./events";
import { getContainer } from "./dom-utils";

type OptionProps = {
  correct?: boolean;
  children: React.ReactNode;
};

export default function Option({ correct, children }: OptionProps) {
  const [selected, setSelected] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [optionIdx, setOptionIdx] = useState(-1);

  useEffect(() => {
    if (!buttonRef.current) return;

    const options = getContainer(buttonRef.current);

    setOptionIdx(
      Array.from(options.querySelectorAll(".exercise-option")).indexOf(
        buttonRef.current
      )
    );

    options.addEventListener(CLEAR_OPTIONS_EVENT, (event) => {
      const { index } = (event as CustomEvent).detail;
      if (index !== optionIdx) {
        setSelected(false);
      }
    });
  }, [buttonRef.current]);

  const handleClick = () => {
    if (!buttonRef.current) return;

    const options = getContainer(buttonRef.current);
    dispatchClearOptionsEvent(options, optionIdx);
    if (!selected) {
      dispatchOptionSelected(options, optionIdx);
      setSelected(true);
    }
  };

  const className = `exercise-option ${Styles.option} ${
    selected ? Styles.optionSelected : ""
  }`;

  return (
    <button
      className={className}
      onClick={handleClick}
      ref={buttonRef}
      data-correct={correct ? "correct" : ""}
    >
      <div className={Styles.optionContent}>{children}</div>
    </button>
  );
}
