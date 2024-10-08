import React, { useEffect, useRef, useState, type ReactNode } from "react";
import * as draggable from "@shopify/draggable";
import Styles from "./styles.module.scss";
import { Classes } from "./draggable-types";
import ParsonsLine from "./ParsonsLine";
import config from "virtual:active-handout/user-config";
import { useTranslations } from "../../../../utils/translations";
import { INDENTATION } from "../indentation";
import type { ParsonsLineData } from "./parsons-types";

const t = useTranslations(config.lang);

type ParsonsLineContainerProps = {
  availableLines: ParsonsLineData[];
  selectedLines: ParsonsLineData[];
  withIndentation: boolean;
  onAnswerChanged: (answer: string) => void;
  maxIndentation: number;
  singleColumn: boolean;
  disabled: boolean;
};

export default function ParsonsLineContainer({
  availableLines,
  selectedLines,
  withIndentation,
  onAnswerChanged,
  maxIndentation,
  singleColumn,
  disabled,
}: ParsonsLineContainerProps) {
  const sortable = useRef<draggable.Sortable | null>(null);
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
        `.${Classes.draggable}:not(.draggable-mirror):not(.draggable--original)`
      ),
    ];
    const answer = selectedLines
      .map(
        (item) =>
          `${INDENTATION.repeat(parseInt(item.dataset.indentation || "0"))}${
            item.textContent
          }`
      )
      .join("\n");
    onAnswerChanged(answer);
  };

  const observeResize = (elements: HTMLUListElement[]) => {
    const newMinHeight = Math.max(
      ...elements.map((element) => element.offsetHeight)
    );

    const observer = new ResizeObserver(() => {
      elements.forEach((element) => {
        const previousMinHeightStr =
          element.style.getPropertyValue("--min-height");
        let previousMinHeight = 0;
        if (previousMinHeightStr) {
          previousMinHeight = parseFloat(previousMinHeightStr);
        }
        if (previousMinHeight < newMinHeight) {
          element.style.setProperty("--min-height", `${newMinHeight}px`);
        }
      });
    });
    elements.forEach((element) => {
      observer.observe(element);
    });
  };

  useEffect(() => {
    if (
      (!singleColumn && !availableLinesList.current) ||
      !selectedLinesList.current
    ) {
      return;
    }

    if (availableLinesList.current) {
      observeResize([availableLinesList.current, selectedLinesList.current]);
    } else {
      observeResize([selectedLinesList.current]);
    }

    if (!sortable.current) {
      const containers = [selectedLinesList.current];
      if (availableLinesList.current) {
        containers.push(availableLinesList.current);
      }
      sortable.current = new draggable.Sortable(containers, {
        draggable: `.${Classes.draggable}`,
        handle: `.${Classes.draggableHandle}`,
        mirror: {
          constrainDimensions: true,
        },
        plugins: [draggable.Plugins.ResizeMirror],
      });

      sortable.current.on("drag:start", (event: draggable.DragStartEvent) => {
        const container = event.sourceContainer.closest<HTMLDivElement>(
          `.${Styles.parsonsBlockContainer}`
        );
        const disabled = container?.dataset.disabled === "true";
        if (disabled) {
          event.cancel();
        }
      });

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

  const [availableLineNodes, selectedLineNodes] = buildLineNodes(
    availableLines,
    selectedLines,
    withIndentation,
    maxIndentation,
    singleColumn,
    disabled,
    updateAnswer
  );

  const blockClassNames = [Styles.parsonsBlockContainer];
  if (singleColumn) {
    blockClassNames.push(Styles.parsonsBlockContainerSingleColumn);
  }

  return (
    <div className={blockClassNames.join(" ")} data-disabled={disabled}>
      {!singleColumn && (
        <div className={Styles.linesContainerBlock}>
          <span className={Styles.blockTitle}>
            {t("parsons.drag-from-here")}
          </span>
          <ul
            ref={availableLinesList}
            className={availablesContainerClasses.join(" ")}
          >
            {availableLineNodes}
          </ul>
        </div>
      )}
      <div className={Styles.linesContainerBlock}>
        <span className={Styles.blockTitle}>
          {singleColumn ? t("parsons.sort-lines") : t("parsons.drop-here")}
        </span>
        <ul
          ref={selectedLinesList}
          className={selectedsContainerClasses.join(" ")}
        >
          {selectedLineNodes}
        </ul>
      </div>
    </div>
  );
}

function buildLineNodes(
  availableLines: ParsonsLineData[],
  selectedLines: ParsonsLineData[],
  withIndentation: boolean,
  maxIndentation: number,
  singleColumn: boolean,
  disabled: boolean,
  updateAnswer: () => void
) {
  const props = {
    withIndentation,
    maxIndentation,
    disabled,
    onIndentationChanged: updateAnswer,
  };
  let availableLineNodes: ReactNode[] = availableLines.map((line, index) => {
    return (
      <ParsonsLine
        line={line.htmlContent}
        key={`parsons-line--${line}-${index}`}
        {...props}
      />
    );
  });
  let selectedLineNodes: ReactNode[] = selectedLines.map((line, index) => {
    return (
      <ParsonsLine
        line={line.htmlContent}
        indent={line.indent}
        key={`parsons-line--${line}-${index}`}
        {...props}
      />
    );
  });
  if (singleColumn) {
    selectedLineNodes = availableLineNodes.concat(selectedLineNodes);
    availableLineNodes = [];
  }

  return [availableLineNodes, selectedLineNodes];
}
