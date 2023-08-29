import React from "react";
import type BaseProps from "./props";
import Styles from "./styles.module.scss";

type AdmonitionProps = BaseProps & {
  renderTitleRight?: () => React.ReactNode;
  children: React.ReactNode;
};

export default function Admonition({
  title,
  collapsible,
  collapsed,
  type = "default",
  renderTitleRight,
  children,
}: AdmonitionProps) {
  const className = `${Styles.admonition} ${Styles[type]} ${
    collapsible ? Styles["admonition-details"] : ""
  }}`;

  const rightIcon = renderTitleRight ? (
    <div className={Styles["title-right-container"]}>{renderTitleRight()}</div>
  ) : null;

  if (collapsible) {
    return (
      <details className={className} open={collapsed}>
        <summary className={Styles["admonition-title"]}>
          {title} {rightIcon}
        </summary>
        <div className={Styles["admonition-content"]}>{children}</div>
      </details>
    );
  }
  return (
    <div className={className}>
      {title && (
        <div className={Styles["admonition-title"]}>
          {title} {rightIcon}
        </div>
      )}
      <div className={Styles["admonition-content"]}>{children}</div>
    </div>
  );
}
