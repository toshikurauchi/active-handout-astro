import React, { type CSSProperties, useState, useEffect } from "react";
import { Classes } from "./draggable-types";
import Styles from "./styles.module.scss";
import ChevronLeft from "../../icons/ChevronLeft";
import ChevronRight from "../../icons/ChevronRight";

type ParsonsIndentedLineProps = {
  line: string;
  maxIndentation: number;
  onIndentationChanged?: ((indentation: number) => void) | undefined;
};

export default function ParsonsIndentedLine({
  line,
  maxIndentation,
  onIndentationChanged,
}: ParsonsIndentedLineProps) {
  const [indentation, setIndentation] = useState<number>(0);

  useEffect(() => {
    if (onIndentationChanged) {
      onIndentationChanged(indentation);
    }
  }, [indentation]);

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
      data-indentation={indentation}
    >
      <button
        onClick={handleDecreaseIndent}
        className={Styles.indentationButton}
        disabled={indentation <= 0}
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
          className={[Styles.parsonsLineContent].join(" ")}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      </div>
      <button
        onClick={handleIncreaseIndent}
        className={Styles.indentationButton}
        disabled={indentation >= maxIndentation}
      >
        <ChevronRight />
      </button>
    </li>
  );
}
