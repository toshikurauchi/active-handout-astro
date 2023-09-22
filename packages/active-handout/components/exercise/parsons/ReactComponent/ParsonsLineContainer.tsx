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

  const updateAnswer = () => {
    if (!selectedLinesList.current) {
      return;
    }

    const selectedLines = [
      ...selectedLinesList.current.querySelectorAll<HTMLLIElement>(
        `.${Classes.draggable}:not(.draggable-mirror)`
      ),
    ];
    const answer = selectedLines
      .map(
        (item) =>
          `${"    ".repeat(parseInt(item.dataset.indentation || "0"))}${
            item.textContent
          }`
      )
      .join("\n");
    onAnswerChanged(answer);
  };

  const observeResize = (element: HTMLUListElement) => {
    const observer = new ResizeObserver(() => {
      const previousMinHeightStr =
        element.style.getPropertyValue("--min-height");
      if (previousMinHeightStr) {
        const previousMinHeight = parseFloat(previousMinHeightStr);
        if (previousMinHeight > element.offsetHeight) {
          element.style.setProperty(
            "--min-height",
            `${element.offsetHeight}px`
          );
        }
      } else {
        element.style.setProperty("--min-height", `${element.offsetHeight}px`);
      }
    });
    observer.observe(element);
  };

  useEffect(() => {
    if (!availableLinesList.current || !selectedLinesList.current) {
      return;
    }

    observeResize(availableLinesList.current);
    observeResize(selectedLinesList.current);

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

        updateAnswer();
      });
    }
  }, [availableLinesList.current, selectedLinesList.current]);

  const availablesContainerClasses = [Styles.linesContainer];
  const selectedsContainerClasses = [Styles.linesContainer];

  if (withIndentation) {
    availablesContainerClasses.push(Styles.linesContainerWithIndentation);
    selectedsContainerClasses.push(Styles.linesContainerWithIndentation);
  }

  if (currentContainer && currentContainer === availableLinesList.current) {
    availablesContainerClasses.push(Styles.linesContainerActive);
  }
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
              onIndentationChanged={updateAnswer}
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
