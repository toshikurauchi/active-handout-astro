import React from "react";
import type BaseProps from "./props";
import Styles from "./styles.module.scss";

type AdmonitionProps = BaseProps & {
  renderTitleRight?: () => React.ReactNode;
  hasCounter?: boolean;
  children: React.ReactNode;
};

export default function Admonition({
  title,
  collapsible,
  collapsed,
  type = "default",
  renderTitleRight,
  hasCounter,
  children,
}: AdmonitionProps) {
  const classNames = [Styles.admonition, Styles[type]];
  if (collapsible) {
    classNames.push(Styles["admonition-details"]);
  }
  if (hasCounter) {
    classNames.push(Styles["admonition-with-counter"]);
  }
  const className = classNames.join(" ");

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
          <span className={Styles["admonition-title-title"]}>{title}</span>{" "}
          {rightIcon}
        </div>
      )}
      <div className={Styles["admonition-content"]}>{children}</div>
    </div>
  );
}
