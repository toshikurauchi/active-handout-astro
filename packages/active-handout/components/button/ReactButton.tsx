import React, { useEffect } from "react";
import Styles from "./styles.module.scss";
import type BaseProps from "./props";

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  primary,
  transparent,
  colorScheme,
  leftImg,
  rightImg,
  tooltip,
  tooltipPlacement,
  children,
  ...props
}: ButtonProps) {
  const className = `${Styles.button} ${
    transparent ? Styles.transparent : primary ? Styles.primary : ""
  } ${colorScheme ? Styles[colorScheme] : ""}`;
  const [showTooltip, setShowTooltip] = React.useState(false);

  useEffect(() => {
    // We do this instead of using CSS hover because we want the tooltip to
    // not be rendered on the server
    document.addEventListener("mouseenter", () => {
      setShowTooltip(true);
    });
    document.addEventListener("mouseleave", () => {
      setShowTooltip(false);
    });
  }, []);

  return (
    <button className={className} {...props}>
      {showTooltip && tooltip && (
        <span
          className={`${Styles.tooltip} ${
            Styles[tooltipPlacement || "bottom"]
          }`}
        >
          {tooltip}
        </span>
      )}
      {leftImg && <img src={leftImg} className={Styles.leftImg} />}
      <span className={Styles.buttonContent}>{children}</span>
      {rightImg && <img src={rightImg} className={Styles.rightImg} />}
    </button>
  );
}
