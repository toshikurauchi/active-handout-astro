import icon from "../../assets/icon/copy-icon.svg";

function createCopyButton(parent: HTMLElement, tooltip: HTMLElement) {
  const button = document.createElement("button");
  button.classList.add("code-clipboard-btn");
  button.innerHTML = `<img src="${icon.src}" alt="Copy to clipboard">`;

  const codeElement = parent?.querySelector("code");
  if (!parent || !codeElement) {
    throw new Error("No code element found for clipboard button");
  }
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(codeElement.innerText);
    if (tooltip) {
      tooltip.classList.add("show");
      setTimeout(() => {
        tooltip.classList.remove("show");
      }, 1000);
    }
  });

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

  const tooltip = createTooltip();
  preElement.insertBefore(tooltip, preElement.firstChild);
  preElement.insertBefore(
    createCopyButton(preElement, tooltip),
    preElement.firstChild
  );
  preElement.addEventListener("scroll", updateScrollOffset);
});
