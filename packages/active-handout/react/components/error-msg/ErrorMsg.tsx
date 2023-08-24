import React from "react";
import Styles from "./styles.module.scss";

type ErrorMsgProps = {
  visible?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>;

export default function ErrorMsg({
  visible,
  children,
  ...props
}: ErrorMsgProps) {
  const className = `${Styles.errorMsg}`;
  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
}
