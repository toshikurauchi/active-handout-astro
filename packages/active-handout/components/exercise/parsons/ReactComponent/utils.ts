import { runPythonTests } from "../../../python-local-server/python-utils";
import { INDENTATION } from "../indentation";
import type { ParsonsLineData } from "./parsons-types";

export function getAnswerPointsFromLocalStorage(
  registryKey: string,
  studentAnswer: string
) {
  const exerciseDataStr = localStorage.getItem(registryKey);
  if (exerciseDataStr) {
    const exerciseData = JSON.parse(exerciseDataStr);
    const expectedAnswer = exerciseData?.expected;
    if (studentAnswer === expectedAnswer) {
      return 100;
    }
    return 0;
  }
  return -1;
}

export function splitLinesIntoAvailableAndSelected(
  lines: ParsonsLineData[],
  studentAnswer: string
): [ParsonsLineData[], ParsonsLineData[]] {
  let newAvailableLines: ParsonsLineData[] = [...lines];
  const newSelectedLines: ParsonsLineData[] = [];

  for (const targetLineWithIndent of studentAnswer.split("\n")) {
    const indent = countIndentation(targetLineWithIndent);
    const targetLine = targetLineWithIndent.trim();
    const filteredAvailableLines = [];
    let found = false;
    for (const line of newAvailableLines) {
      if (!found && targetLine === line.plainContent) {
        newSelectedLines.push({ ...line, indent });
      } else {
        filteredAvailableLines.push(line);
      }
    }
    newAvailableLines = filteredAvailableLines;
  }

  return [newAvailableLines, newSelectedLines];
}

function countIndentation(line: string): number {
  let spaces = 0;
  for (const c of line) {
    if (c === " ") {
      spaces++;
    } else {
      break;
    }
  }
  return spaces / INDENTATION.length;
}

export function loadAndRunPythonTests(
  slug: string,
  pythonTestsSrc: string,
  studentAnswer: string
) {
  fetch(pythonTestsSrc)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.text();
    })
    .then((pythonTestStr) => {
      runPythonTests(slug, studentAnswer, pythonTestStr);
    })
    .catch((error) => {
      console.error("Error fetching python tests", error);
      return null;
    });
}
