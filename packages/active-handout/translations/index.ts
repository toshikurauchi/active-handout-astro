import { builtinI18nSchema } from '../schemas/i18n';
import en from "./en.json";
import pt from './pt.json';

const { parse } = builtinI18nSchema();

export default Object.fromEntries(
  Object.entries({ en, pt }).map(([key, dict]) => [
    key,
    parse(dict),
  ])
);