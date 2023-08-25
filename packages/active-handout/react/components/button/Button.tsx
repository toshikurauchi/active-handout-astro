import React from "react";
import Styles from "./styles.module.scss";

type ButtonProps = {
  primary?: boolean;
  colorScheme?: string;
  leftImg?: string;
  rightImg?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  primary,
  colorScheme,
  leftImg,
  rightImg,
  children,
  ...props
}: ButtonProps) {
  const className = `${Styles.button} ${primary ? Styles.primary : ""} ${
    colorScheme ? Styles[colorScheme] : ""
  }`;
  return (
    <button className={className} {...props}>
      {leftImg && <img src={leftImg} className={Styles.leftImg} />}
      <span className={Styles.buttonContent}>{children}</span>
      {rightImg && <img src={rightImg} className={Styles.rightImg} />}
    </button>
  );
}
