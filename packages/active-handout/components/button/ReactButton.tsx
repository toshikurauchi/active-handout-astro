import React from "react";
import Styles from "./styles.module.scss";
import type BaseProps from "./props";

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  primary,
  transparent,
  colorScheme,
  leftImg,
  rightImg,
  children,
  ...props
}: ButtonProps) {
  const className = `${Styles.button} ${
    transparent ? Styles.transparent : primary ? Styles.primary : ""
  } ${colorScheme ? Styles[colorScheme] : ""}`;
  return (
    <button className={className} {...props}>
      {leftImg && <img src={leftImg} className={Styles.leftImg} />}
      <span className={Styles.buttonContent}>{children}</span>
      {rightImg && <img src={rightImg} className={Styles.rightImg} />}
    </button>
  );
}
