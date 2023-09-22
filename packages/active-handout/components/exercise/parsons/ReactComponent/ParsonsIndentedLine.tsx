import React, { type CSSProperties, useState } from "react";
import { Classes } from "./draggable-types";
import Styles from "./styles.module.scss";
import ChevronLeft from "../../icons/ChevronLeft";
import ChevronRight from "../../icons/ChevronRight";

type ParsonsIndentedLineProps = {
  line: string;
  maxIndentation: number;
};

export default function ParsonsIndentedLine({
  line,
  maxIndentation,
}: ParsonsIndentedLineProps) {
  const [indentation, setIndentation] = useState<number>(0);

  const classNames = [
    Classes.draggable,
    Styles.parsonsLine,
    Styles.parsonsLineWithIndentation,
  ];

  const handleDecreaseIndent = () => {
    setIndentation((i) => Math.max(i - 1, 0));
  };

  const handleIncreaseIndent = () => {
    setIndentation((i) => Math.min(i + 1, maxIndentation));
  };

  return (
    <li
      className={classNames.join(" ")}
      style={{ "--max-indent": maxIndentation } as CSSProperties}
      data-max-indent={maxIndentation}
    >
      <button
        onClick={handleDecreaseIndent}
        className={Styles.indentationButton}
      >
        <ChevronLeft />
      </button>
      <div
        className={[Styles.indentedLineContainer, Classes.draggableHandle].join(
          " "
        )}
      >
        {indentation > 0 &&
          Array.from({ length: indentation }).map((_, i) => (
            <span key={i} className={Styles.parsonsLineIndent} />
          ))}
        <div
          className={[Styles.parsonsLineContent, Classes.nestedDraggable].join(
            " "
          )}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      </div>
      <button
        onClick={handleIncreaseIndent}
        className={Styles.indentationButton}
      >
        <ChevronRight />
      </button>
    </li>
  );
}
