export function runPythonCode(slug: string, code: string) {
  const pythonServerElement = getServerElement();

  const event = new CustomEvent("RunPythonCode", {
    detail: {
      code,
      slug,
    },
  });
  pythonServerElement?.dispatchEvent(event);
}

export function runPythonTests(slug: string, code: string, testCode: string) {
  const pythonServerElement = getServerElement();

  const event = new CustomEvent("RunPythonTests", {
    detail: {
      code,
      testCode,
      slug,
    },
  });
  pythonServerElement?.dispatchEvent(event);
}

export function registerPythonResultListener(
  slug: string,
  listener: (data: any) => void
) {
  const pythonServerElement = getServerElement();
  pythonServerElement?.addEventListener("PythonResult", ((
    event: CustomEvent
  ) => {
    if (event.detail.key === slug) {
      listener(event.detail.data);
    }
  }) as EventListener);
}

function getServerElement() {
  return document.getElementById("python-server");
}
