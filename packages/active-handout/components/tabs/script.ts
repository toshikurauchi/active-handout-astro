document.querySelectorAll(".tabgroup").forEach((tabgroup) => {
  const labels = Array.from(tabgroup.querySelectorAll(".tab--label")).filter(
    (el) => el.parentElement?.parentElement === tabgroup
  );
  const contents = Array.from(
    tabgroup.querySelectorAll(".tab--content")
  ).filter((el) => el.parentElement?.parentElement === tabgroup);

  setLabelClickListeners(labels, contents);
  setLabelLengthRestrictions(tabgroup, labels);
});

function setLabelClickListeners(labels: Element[], contents: Element[]) {
  labels.forEach((label) => {
    label.addEventListener("click", (event) => {
      const label = event.target as HTMLElement;

      labels.forEach((label) => label.classList.remove("active"));
      contents.forEach((content) => content.classList.remove("active"));

      const index = labels.indexOf(label);
      labels[index]?.classList.add("active");
      contents[index]?.classList.add("active");
    });
  });
}

function setLabelLengthRestrictions(tabgroup: Element, labels: Element[]) {
  /**
   * This function adds a class to the contents element if the contents are
   * wider than the labels. This is used to add a border radius to the
   * contents element top-right corner.
   **/

  const contentsContainer = tabgroup.querySelector(".tabgroup--contents");
  if (!labels || !contentsContainer) {
    return;
  }

  const labelsRight = Math.max(
    ...labels.map((label) => label.getBoundingClientRect().right)
  );
  const contentsRight = contentsContainer.getBoundingClientRect().right;
  const borderRadius = Number.parseInt(
    getComputedStyle(contentsContainer).borderBottomLeftRadius
  );

  const widerThanLabelsClass = "tabgroup--contents--wider-than-labels";
  if (labelsRight <= contentsRight - borderRadius) {
    contentsContainer.classList.add(widerThanLabelsClass);
  } else {
    contentsContainer.classList.remove(widerThanLabelsClass);
  }
}
