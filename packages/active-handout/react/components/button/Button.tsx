import React from "react";
import Styles from "./styles.module.scss";

type ButtonProps = {
  primary?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ primary, children, ...props }: ButtonProps) {
  const className = `${Styles.button} ${primary ? Styles.primary : ""}`;
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
