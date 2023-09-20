/**
 * termynal.js
 * A lightweight, modern and extensible animated terminal window, using
 * async/await.
 *
 * @author Ines Montani <ines@ines.io>
 * @version 0.0.1
 * @license MIT
 *
 * Adapted for Astro+Typescript by Andrew Kurauchi
 */

export type LineData = {
  type?: "input" | "progress";
  value: string;
  delay?: number;
};

export type TermynalOptions = {
  prefix?: string;
  startDelay?: number;
  typeDelay?: number;
  lineDelay?: number;
  progressLength?: number;
  progressChar?: string;
  progressPercent?: number;
  cursor?: string;
  lineData?: LineData[];
  noInit?: boolean;
};

/** Generate a terminal widget. */
export class Termynal {
  container: HTMLElement;
  pfx: string;
  startDelay: number;
  typeDelay: number;
  lineDelay: number;
  progressLength: number;
  progressChar: string;
  progressPercent: number;
  cursor: string;
  lineData: HTMLElement[];
  lines: HTMLElement[];

  /**
   * Construct the widget's settings.
   * @param {(string|Node)=} container - Query selector or container element.
   * @param {Object=} options - Custom settings.
   * @param {string} options.prefix - Prefix to use for data attributes.
   * @param {number} options.startDelay - Delay before animation, in ms.
   * @param {number} options.typeDelay - Delay between each typed character, in ms.
   * @param {number} options.lineDelay - Delay between each line, in ms.
   * @param {number} options.progressLength - Number of characters displayed as progress bar.
   * @param {string} options.progressChar – Character to use for progress bar, defaults to █.
   * @param {number} options.progressPercent - Max percent of progress.
   * @param {string} options.cursor – Character to use for cursor, defaults to ▋.
   * @param {Object[]} lineData - Dynamically loaded line data objects.
   * @param {boolean} options.noInit - Don't initialise the animation.
   */
  constructor(
    container: string | HTMLElement = "#termynal",
    options: TermynalOptions = {}
  ) {
    const tempContainer =
      typeof container === "string"
        ? (document.querySelector(container) as HTMLElement | null)
        : container;
    if (tempContainer === null) {
      throw new Error("Termynal container not found.");
    }
    this.container = tempContainer;

    this.pfx = `data-${options.prefix || "ty"}`;
    this.startDelay =
      options.startDelay ||
      _getNumberAttribute(this.container, `${this.pfx}-startDelay`, 600);
    this.typeDelay =
      options.typeDelay ||
      _getNumberAttribute(this.container, `${this.pfx}-typeDelay`, 90);
    this.lineDelay =
      options.lineDelay ||
      _getNumberAttribute(this.container, `${this.pfx}-lineDelay`, 1500);
    this.progressLength =
      options.progressLength ||
      _getNumberAttribute(this.container, `${this.pfx}-progressLength`, 40);
    this.progressChar =
      options.progressChar ||
      this.container.getAttribute(`${this.pfx}-progressChar`) ||
      "█";
    this.progressPercent =
      options.progressPercent ||
      _getNumberAttribute(this.container, `${this.pfx}-progressPercent`, 100);
    this.cursor =
      options.cursor ||
      this.container.getAttribute(`${this.pfx}-cursor`) ||
      "▋";
    this.lineData = this.lineDataToElements(options.lineData || []);
    this.lines = [];
    if (!options.noInit) this.init();
  }

  /**
   * Initialise the widget, get lines, clear container and start animation.
   */
  init() {
    // Appends dynamically loaded lines to existing line elements.
    this.lines = (
      [...this.container.querySelectorAll(`[${this.pfx}]`)] as HTMLElement[]
    ).concat(this.lineData);

    /**
     * Calculates width and height of Termynal container.
     * If container is empty and lines are dynamically loaded, defaults to browser `auto` or CSS.
     */
    const containerStyle = getComputedStyle(this.container);
    if (containerStyle.width !== "0px") {
      this.container.style.width = containerStyle.width;
    }
    if (containerStyle.height !== "0px") {
      this.container.style.height = containerStyle.height;
    }

    this.container.setAttribute("data-termynal", "");
    this.container.innerHTML = "";
    this.start();
  }

  /**
   * Start the animation and rener the lines depending on their data attributes.
   */
  async start() {
    await this._wait(this.startDelay);

    for (let line of this.lines) {
      const type = line.getAttribute(this.pfx);
      const delay = parseFloat(
        line.getAttribute(`${this.pfx}-delay`) || `${this.lineDelay}`
      );

      if (type == "input") {
        line.setAttribute(`${this.pfx}-cursor`, this.cursor);
        await this.type(line);
        await this._wait(delay);
      } else if (type == "progress") {
        await this.progress(line);
        await this._wait(delay);
      } else {
        this.container.appendChild(line);
        await this._wait(delay);
      }

      line.removeAttribute(`${this.pfx}-cursor`);
    }
  }

  /**
   * Animate a typed line.
   * @param {Node} line - The line element to render.
   */
  async type(line: HTMLElement) {
    const chars = [...(line.textContent as string)];
    const delay = _getNumberAttribute(
      line,
      `${this.pfx}-typeDelay`,
      this.typeDelay
    );
    line.textContent = "";
    this.container.appendChild(line);

    for (let char of chars) {
      await this._wait(delay);
      line.textContent += char;
    }
  }

  /**
   * Animate a progress bar.
   * @param {Node} line - The line element to render.
   */
  async progress(line: HTMLElement) {
    const progressLength = _getNumberAttribute(
      line,
      `${this.pfx}-progressLength`,
      this.progressLength
    );
    const progressChar =
      line.getAttribute(`${this.pfx}-progressChar`) || this.progressChar;
    const chars = progressChar.repeat(progressLength);
    const progressPercent = _getNumberAttribute(
      line,
      `${this.pfx}-progressPercent`,
      this.progressPercent
    );
    line.textContent = "";
    this.container.appendChild(line);

    for (let i = 1; i < chars.length + 1; i++) {
      await this._wait(this.typeDelay);
      const percent = Math.round((i / chars.length) * 100);
      line.textContent = `${chars.slice(0, i)} ${percent}%`;
      if (percent > progressPercent) {
        break;
      }
    }
  }

  /**
   * Helper function for animation delays, called with `await`.
   * @param {number} time - Timeout, in ms.
   */
  _wait(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * Converts line data objects into line elements.
   *
   * @param {Object[]} lineData - Dynamically loaded lines.
   * @param {Object} line - Line data object.
   * @returns {Element[]} - Array of line elements.
   */
  lineDataToElements(lineData: LineData[]) {
    return lineData.map((line) => {
      let div = document.createElement("div");
      div.innerHTML = `<span ${this._attributes(line)}>${
        line.value || ""
      }</span>`;

      return div.firstElementChild as HTMLElement;
    });
  }

  /**
   * Helper function for generating attributes string.
   *
   * @param {Object} line - Line data object.
   * @returns {string} - String of attributes.
   */
  _attributes(line: LineData) {
    let attrs = "";
    for (let prop in line) {
      attrs += this.pfx;

      if (prop === "type") {
        attrs += `="${line[prop]}" `;
      } else if (prop !== "value") {
        attrs += `-${prop}="${line[prop as keyof LineData]}" `;
      }
    }

    return attrs;
  }
}

function _getNumberAttribute(
  element: Element,
  attribute: string,
  fallback: number
) {
  const value = element.getAttribute(attribute);
  if (value === null) return fallback;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return fallback;
  return parsed;
}
