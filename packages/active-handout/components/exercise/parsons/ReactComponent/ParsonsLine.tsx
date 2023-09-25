import React from "react";
import { Classes } from "./draggable-types";
import Styles from "./styles.module.scss";
import ParsonsIndentedLine from "./ParsonsIndentedLine";

type ParsonsLineProps = {
  line: string;
  indent?: number;
  withIndentation: boolean;
  maxIndentation: number;
  disabled: boolean;
  onIndentationChanged?: ((indentation: number) => void) | undefined;
};

export default function ParsonsLine({
  line,
  indent,
  withIndentation,
  maxIndentation,
  disabled,
  onIndentationChanged,
}: ParsonsLineProps) {
  const classNames = [Classes.draggable, Styles.parsonsLine];

  if (withIndentation) {
    return (
      <ParsonsIndentedLine
        line={line}
        indent={indent}
        maxIndentation={maxIndentation}
        disabled={disabled}
        onIndentationChanged={onIndentationChanged}
      />
    );
  }
  return (
    <li className={classNames.join(" ")} data-indentation={0}>
      <div
        className={[Styles.parsonsLineContent, Classes.draggableHandle].join(
          " "
        )}
        dangerouslySetInnerHTML={{ __html: line }}
      />
    </li>
  );
}
