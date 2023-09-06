import React, { type ReactNode, useState, useEffect } from "react";
import { buildAnchorId, buildId } from "./utils";
import Styles from "./styles.module.scss";
import {
  type ToggleSidenoteEvent,
  dispatchToggleSidenote,
} from "./custom-events";

type SidenoteAnchorProps = {
  forId: string;
  children: ReactNode;
};

export default function SidenoteAnchor({
  forId: baseId,
  children,
}: SidenoteAnchorProps) {
  const forId = buildId(baseId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener(
      "ToggleSidenote",
      (event: ToggleSidenoteEvent) => {
        const { sidenoteId, open } = event.detail;
        if (sidenoteId !== forId) return;

        setOpen(open);
      }
    );
  }, []);

  const toggleSidenote = () => {
    dispatchToggleSidenote(forId, !open);
  };

  const buttonClassName = `${Styles.toggleSidenote} ${
    open ? Styles.anchorOpen : ""
  }`;

  return (
    <span
      className={Styles.sidenoteAnchor}
      id={buildAnchorId(baseId)}
      onClick={toggleSidenote}
    >
      {children}
      <button className={buttonClassName} onClick={toggleSidenote}>
        +
      </button>
    </span>
  );
}
