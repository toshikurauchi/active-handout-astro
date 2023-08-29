import React from "react";
import Styles from "./styles.module.scss";
import ErrorMsg from "../error-msg/ReactErrorMsg";

type FormInputProps = {
  labelText: string;
  errorMsg?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({
  labelText,
  errorMsg,
  ...props
}: FormInputProps) {
  if (labelText && !props.id) {
    throw new Error("Input must have an id if it has a label");
  }

  return (
    <div className={Styles.inputContainer}>
      {labelText && <label htmlFor={props.id}>{labelText}</label>}
      <input {...props} />
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </div>
  );
}
