import { init, register, locale, waitLocale } from 'svelte-i18n';

const LANGS = [
  'en', 'fr', 'es', 'de', 'it', 'nl', 'pt', 'bg', 'hr', 'cs', 'da', 'et',
  'fi', 'el', 'hu', 'ga', 'lv', 'lt', 'mt', 'pl', 'ro', 'sk', 'sl', 'sv',
] as const;

export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  nl: 'Nederlands',
  pt: 'Português',
  bg: 'Български',
  hr: 'Hrvatski',
  cs: 'Čeština',
  da: 'Dansk',
  et: 'Eesti',
  fi: 'Suomi',
  el: 'Ελληνικά',
  hu: 'Magyar',
  ga: 'Gaeilge',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  mt: 'Malti',
  pl: 'Polski',
  ro: 'Română',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sv: 'Svenska',
};

for (const lang of LANGS) {
  register(lang, () => import(`./locales/${lang}.json`));
}

const STORAGE_KEY = 'sirroco_lang';

function readInitial(): Lang {
  if (typeof localStorage === 'undefined') return 'fr';
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && (LANGS as readonly string[]).includes(saved) ? (saved as Lang) : 'fr';
}

init({
  fallbackLocale: 'en',
  initialLocale: readInitial(),
});

export const i18nReady = waitLocale();

export function setLanguage(lang: Lang) {
  locale.set(lang);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

export { LANGS };
