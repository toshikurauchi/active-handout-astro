// https://clipboardjs.com/
import ClipboardJS from "clipboard";
import icon from "./copy-icon.svg";

function createCopyButton() {
  const button = document.createElement("button");
  button.classList.add("code-clipboard-btn");
  button.innerHTML = `<img src="${icon.src}" alt="Copy to clipboard">`;
  return button;
}

function createTooltip() {
  const tooltip = document.createElement("span");
  tooltip.classList.add("code-clipboard-tooltip");
  tooltip.innerText = "Copied!";
  return tooltip;
}

const codeBlocks = document.querySelectorAll("pre code");

function updateScrollOffset(event: Event) {
  const target = event.target as HTMLElement;
  const clipboardBtn = target.querySelector(
    ".code-clipboard-btn"
  ) as HTMLElement;
  clipboardBtn?.style.setProperty("--scroll-offset", `${target.scrollLeft}px`);
}

codeBlocks.forEach((codeBlock) => {
  const preElement = codeBlock.closest("pre");
  if (!preElement) {
    return;
  }

  preElement.insertBefore(createTooltip(), preElement.firstChild);
  preElement.insertBefore(createCopyButton(), preElement.firstChild);
  preElement.addEventListener("scroll", updateScrollOffset);
});

const clipboard = new ClipboardJS(".code-clipboard-btn", {
  target: (copyButton: HTMLElement) => {
    const parent = copyButton.parentElement;
    const codeElement = parent?.querySelector("code");
    if (!parent || !codeElement) {
      throw new Error("No code element found for clipboard button");
    }

    return codeElement;
  },
});

clipboard.on("success", function (e) {
  const parent = e.trigger.parentElement;
  const tooltip = parent?.querySelector(".code-clipboard-tooltip");
  if (tooltip) {
    tooltip.classList.add("show");
    setTimeout(() => {
      tooltip.classList.remove("show");
    }, 1000);
  }
  e.clearSelection();
});
