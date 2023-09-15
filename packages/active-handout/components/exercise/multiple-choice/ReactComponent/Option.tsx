import React from "react";
import Styles from "./styles.module.scss";

type OptionProps = {
  onClick: () => void;
  html: string;
  selected: boolean;
  disabled: boolean;
};

export default function Option({
  html,
  onClick,
  selected,
  disabled,
}: OptionProps) {
  const className = `${Styles.option} ${
    selected ? Styles.optionSelected : ""
  }`.trim();

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <div
        className={Styles.optionContent}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </button>
  );
}
