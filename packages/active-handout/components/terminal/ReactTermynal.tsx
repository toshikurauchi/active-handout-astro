import React, { useEffect, useRef } from "react";
import { Termynal } from "./termynal/termynal";

type ReactTermynalProps = { children: React.ReactNode };

export default function ReactTermynal({ children }: ReactTermynalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setTimeout(() => {
      new Termynal(containerRef.current as HTMLElement, { startDelay: 100 });
    }, 200);
  }, [containerRef]);

  return (
    <div ref={containerRef} data-termynal>
      {children}
    </div>
  );
}
