import React from "react";
import type BaseProps from "./props";
import Styles from "./styles.module.scss";

type AdmonitionProps = BaseProps & {
  children: React.ReactNode;
};

export default function Admonition({
  title,
  collapsible,
  collapsed,
  type = "default",
  children,
}: AdmonitionProps) {
  const className = `${Styles.admonition} ${Styles[type]}`;

  if (collapsible) {
    return (
      <details className={className} open={collapsed}>
        <summary className={Styles["admonition-title"]}>{title}</summary>
        <div className={Styles["admonition-content"]}>{children}</div>
      </details>
    );
  }
  return (
    <div className={className}>
      {title && <div className={Styles["admonition-title"]}>{title}</div>}
      <div className={Styles["admonition-content"]}>{children}</div>
    </div>
  );
}
