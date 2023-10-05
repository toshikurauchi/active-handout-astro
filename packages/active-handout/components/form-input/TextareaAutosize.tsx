// Based on: https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
import React, { type HTMLAttributes, useState, useEffect } from "react";
import Styles from "./styles.module.scss";

type TextareaAutosizeProps = HTMLAttributes<HTMLTextAreaElement> & {
  minLines?: number;
  value?: string;
};

export default function TextareaAutosize({
  minLines,
  onChange,
  ...props
}: TextareaAutosizeProps) {
  const [value, setValue] = useState<string>(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (onChange) onChange(event);
  };

  return (
    <div data-replicated-value={value} className={Styles.textAreaContainer}>
      <textarea {...props} onInput={handleInput} value={value} />
    </div>
  );
}
