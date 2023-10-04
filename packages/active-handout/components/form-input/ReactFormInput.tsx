import React, { type HTMLAttributes, type TextareaHTMLAttributes } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Styles from "./styles.module.scss";
import ErrorMsg from "../error-msg/ReactErrorMsg";

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
          minRows={minLines || 1}
          {...(props as Omit<HTMLAttributes<HTMLTextAreaElement>, "style">)}
        />
      )}
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </div>
  );
}
