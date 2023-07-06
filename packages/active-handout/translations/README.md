# Active Handout UI translation files

This directory contains translation data for Active Handout’s UI.
Each language has its own JSON file.

## Add a new language

1. Create a JSON file named using the BCP-47 tag for the language, e.g. `en.json` or `ja.json`.

2. Fill the file with translations for each UI string. You can base your translations on [`en.json`](./en.json). Translate only the values, leaving the keys in English (e.g. `"search.label": "Buscar"`).

3. Import your file in [`index.ts`](./index.ts) and add your language to the `Object.entries`.

4. Open a pull request on GitHub to add your file to Active Handout!