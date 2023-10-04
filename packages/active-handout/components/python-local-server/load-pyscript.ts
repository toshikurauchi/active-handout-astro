const pythonServerElement = document.getElementById("python-server");

if (pythonServerElement) {
  pythonServerElement.dataset.initialized = "false";
  pythonServerElement.addEventListener("InitializePython", () => {
    if (pythonServerElement.dataset.initialized === "false") {
      pythonServerElement.dataset.initialized = "true";

      const scriptElement = document.createElement("script");
      scriptElement.src = "https://pyscript.net/latest/pyscript.js";
      scriptElement.defer = true;

      document.head.appendChild(scriptElement);
    }

    console.log("Python server initializing...");
  });
}
