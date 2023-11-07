import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm";
import Highlight from "reveal.js/plugin/highlight/highlight.esm";
import Math from "reveal.js/plugin/math/math.esm";

function flagToBool(flag: string | null | undefined): boolean {
  if (typeof flag === "undefined" || flag === "false" || flag === null)
    return false;
  return true;
}

function getConfigFromDataset(container: HTMLElement) {
  return {
    controls: flagToBool(container.dataset.controls),
    controlsTutorial: flagToBool(container.dataset.controlsTutorial),
    controlsLayout: container.dataset.controlsLayout as
      | "edges"
      | "bottom-right",
    controlsBackArrows: container.dataset.controlsBackArrows as
      | "faded"
      | "hidden"
      | "visible",
    progress: flagToBool(container.dataset.progress),
    slideNumber: flagToBool(container.dataset.slideNumber),
    shuffle: flagToBool(container.dataset.shuffle),
  };
}

window.addEventListener("load", () => {
  document
    .querySelectorAll<HTMLElement>(".ah-slide-container")
    .forEach((container) => {
      const revealContainer = container.querySelector(".reveal");

      if (!revealContainer) return;

      let deck = new Reveal(revealContainer, {
        ...getConfigFromDataset(container),
        embedded: true,
        hash: true,
        width: 960,
        height: 700,
        keyboardCondition: "focused",
        plugins: [Markdown, Highlight, Math.KaTeX],
      });
      deck.initialize();
    });
});
