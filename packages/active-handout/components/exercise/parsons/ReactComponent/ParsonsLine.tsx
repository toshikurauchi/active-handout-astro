import React from "react";
import { Classes } from "./draggable-types";
import Styles from "./styles.module.scss";
import ParsonsIndentedLine from "./ParsonsIndentedLine";

type ParsonsLineProps = {
  line: string;
  withIndentation: boolean;
  maxIndentation: number;
};

export default function ParsonsLine({
  line,
  withIndentation,
  maxIndentation,
}: ParsonsLineProps) {
  const classNames = [Classes.draggable, Styles.parsonsLine];

  if (withIndentation) {
    return <ParsonsIndentedLine line={line} maxIndentation={maxIndentation} />;
  }
  return (
    <li className={classNames.join(" ")}>
      <div
        className={[Styles.parsonsLineContent, Classes.draggableHandle].join(
          " "
        )}
        dangerouslySetInnerHTML={{ __html: line }}
      />
    </li>
  );
}
