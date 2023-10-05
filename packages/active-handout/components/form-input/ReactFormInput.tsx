import React, { type HTMLAttributes } from "react";
import Styles from "./styles.module.scss";
import ErrorMsg from "../error-msg/ReactErrorMsg";
import TextareaAutosize from "./TextareaAutosize";

type FormInputProps = {
  labelText?: string;
  errorMsg?: string;
  multiline?: boolean;
  minLines?: number;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({
  labelText,
  errorMsg,
  multiline,
  minLines,
  ...props
}: FormInputProps) {
  if (labelText && !props.id) {
    throw new Error("Input must have an id if it has a label");
  }

  return (
    <div className={Styles.inputContainer}>
      {labelText && <label htmlFor={props.id}>{labelText}</label>}
      {!multiline && <input {...props} />}
      {!!multiline && (
        <TextareaAutosize
          minLines={minLines || 1}
          {...(props as HTMLAttributes<HTMLTextAreaElement>)}
        />
      )}
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </div>
  );
}
