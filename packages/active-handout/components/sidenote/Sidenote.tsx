import React, { useEffect, useRef, useState } from "react";
import { buildId, updateZIndex } from "./utils";
import type { ReactNode } from "react";
import Styles from "./styles.module.scss";
import {
  dispatchToggleSidenote,
  type ToggleSidenoteEvent,
} from "./custom-events";
import { convertRemToPixels, getRemainingSpaceRight } from "./dom-utils";
import { setupResizeObservers } from "./resize-observer";

type SidenoteProps = {
  id: string;
  children: ReactNode;
};

export default function Sidenote({ id: baseId, children }: SidenoteProps) {
  const id = buildId(baseId);
  const [open, setOpen] = useState(false);
  const [fitsSide, setFitsSide] = useState(false);
  const sidenoteContainerRef = useRef<HTMLDivElement>(null);
  const sidenoteRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const toggleSidenote = (event: ToggleSidenoteEvent) => {
      const { sidenoteId, open } = event.detail;
      if (sidenoteId !== id) return;

      setOpen(open);
      updateZIndex(sidenoteRef.current, open);
    };

    document.addEventListener("ToggleSidenote", toggleSidenote);
  }, []);

  useEffect(() => {
    setupResizeObservers(baseId, () => {
      const remainingSpace = getRemainingSpaceRight();
      setFitsSide(remainingSpace >= convertRemToPixels(20));
    });
  }, []);

  useEffect(() => {
    if (!sidenoteContainerRef.current) return;

    for (const property of ["top", "right", "height"]) {
      sidenoteContainerRef.current.style.setProperty(
        `--sidenote-${property}`,
        `var(--${id}-${property})`
      );
      sidenoteContainerRef.current.style.setProperty(
        `--sidenote-top-position`,
        "min(max(var(--sidenote-top) - var(--sidenote-height) / 2, var(--header-height)), var(--max-bottom) - var(--sidenote-height) - 1rem)"
      );
    }
  }, [sidenoteContainerRef.current]);

  const handleCloseSidenote = () => {
    dispatchToggleSidenote(id, false);
  };

  const handleSidenoteClick = () => {
    updateZIndex(sidenoteRef.current, true);
  };

  const asideClassName = `sidenote ${Styles.sidenote} ${
    open ? Styles.sidenoteOpen : ""
  } ${fitsSide ? Styles.sidenoteFitsSide : ""}`;
  const backdropClassName = `${Styles.backdrop} ${
    open && !fitsSide ? Styles.backdropVisible : ""
  }`;
  const sidenoteLineClassName = `${Styles.sidenoteLine} ${
    open && fitsSide ? Styles.sidenoteLineVisible : ""
  }`;

  return (
    <div className="sidenote-container" ref={sidenoteContainerRef}>
      <div className={sidenoteLineClassName}></div>
      <div className={backdropClassName} onClick={handleCloseSidenote}></div>
      <aside
        id={id}
        className={asideClassName}
        ref={sidenoteRef}
        onClick={handleSidenoteClick}
      >
        {children}
      </aside>
    </div>
  );
}
