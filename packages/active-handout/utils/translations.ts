import config from "virtual:active-handout/user-config";
import builtinTranslations from "../translations";

/** User-configured language. */
const defaultLang = config.lang;

/**
 * Generate a utility function that returns UI strings for the given `lang`.
 * @param {string | undefined} [lang]
 * @example
 * const t = useTranslations('en');
 * const label = t('search.label'); // => 'Search'
 */
export function useTranslations(lang: string | undefined) {
  lang = lang || defaultLang;
  const dictionary = builtinTranslations[lang];
  if (!dictionary) {
    throw new Error(`Language ${lang} is not available.`);
  }
  const t = <K extends keyof typeof dictionary>(key: K, args?: any) => {
    let value = dictionary[key];
    if (!args) return value;

    // Replace placeholders with values.
    for (const [k, v] of Object.entries(args) as [string, string][]) {
      value = value.replace(`{${k}}`, v);
    }
    return value;
  };
  t.pick = (startOfKey: string) =>
    Object.fromEntries(
      Object.entries(dictionary).filter(([k]) => k.startsWith(startOfKey))
    );
  return t;
}
