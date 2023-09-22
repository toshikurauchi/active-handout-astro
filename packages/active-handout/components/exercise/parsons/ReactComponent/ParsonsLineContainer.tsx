import React, { useEffect, useRef, useState } from "react";
import { Plugins, Sortable } from "@shopify/draggable";
import Styles from "./styles.module.scss";
import { Classes } from "./draggable-types";
import ParsonsLine from "./ParsonsLine";

type ParsonsLineContainerProps = {
  lines: string[];
  withIndentation: boolean;
  onAnswerChanged: (answer: string) => void;
  maxIndentation: number;
};

export default function ParsonsLineContainer({
  lines,
  withIndentation,
  onAnswerChanged,
  maxIndentation,
}: ParsonsLineContainerProps) {
  const sortable = useRef<Sortable | null>(null);
  const availableLinesList = useRef<HTMLUListElement>(null);
  const selectedLinesList = useRef<HTMLUListElement>(null);
  const [currentContainer, setCurrentContainer] =
    useState<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!availableLinesList.current || !selectedLinesList.current) {
      return;
    }

    if (!sortable.current) {
      sortable.current = new Sortable(
        [availableLinesList.current, selectedLinesList.current],
        {
          draggable: `.${Classes.draggable}`,
          handle: `.${Classes.draggableHandle}`,
          mirror: {
            constrainDimensions: true,
          },
          plugins: [Plugins.ResizeMirror],
        }
      );

      sortable.current.on("drag:over:container", (event: any) => {
        const { overContainer } = event;
        if (overContainer !== currentContainer) {
          setCurrentContainer(overContainer);
        }
      });

      sortable.current.on("drag:stop", () => {
        setCurrentContainer(null);

        if (!selectedLinesList.current) {
          return;
        }

        const selectedLines = [
          ...selectedLinesList.current.querySelectorAll(
            `.${Classes.draggable}:not(.draggable-mirror)`
          ),
        ];

        const answer = selectedLines.map((item) => item.textContent).join("\n");
        onAnswerChanged(answer);
      });
    }
  }, [availableLinesList.current, selectedLinesList.current]);

  const availablesContainerClasses = [Styles.linesContainer];
  if (currentContainer && currentContainer === availableLinesList.current) {
    availablesContainerClasses.push(Styles.linesContainerActive);
  }
  const selectedsContainerClasses = [Styles.linesContainer];
  if (currentContainer && currentContainer === selectedLinesList.current) {
    selectedsContainerClasses.push(Styles.linesContainerActive);
  }

  return (
    <div className={Styles.parsonsBlockContainer}>
      <ul
        ref={availableLinesList}
        className={availablesContainerClasses.join(" ")}
      >
        {lines.map((line, index) => {
          return (
            <ParsonsLine
              line={line}
              withIndentation={withIndentation}
              maxIndentation={maxIndentation}
              key={`parsons-line--${line}-${index}`}
            />
          );
        })}
      </ul>
      <ul
        ref={selectedLinesList}
        className={selectedsContainerClasses.join(" ")}
      ></ul>
    </div>
  );
}
