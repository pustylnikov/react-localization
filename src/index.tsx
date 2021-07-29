import React, { useCallback, useContext } from 'react';

/**
 * Types
 */
type Translate = { [key: string]: string }

type Translates = { [key: string]: Translate }

type Props = {
  value: string,
  children: React.ReactNode,
}

type Options = {
  noTranslatePrefix?: string,
}

type TranslateArgs = { [key: string]: string | number | null | undefined };

export type Translator = (key: string, args?: TranslateArgs) => string

let localization: Translates = {};
let _options: Options = {};
let LocalizationContext: React.Context<string>;

/**
 * Set localization data
 */
export function setLocalizations(data: Translates): void {
  localization = data;
}

export function setOptions(options: Options): void {
  _options = options;
}

/**
 * Returns translate string
 */
export function trans(
  locale: string, key: string, args: TranslateArgs = {}): string {
  const str = getTranslate(locale, key);

  if (Object.keys(args).length) {
    return str.replace(/\{([a-z0-9]+)\}/gm, (...match) => {
      const replacer = args[match[1]];

      return `${replacer ?? (replacer === null ? '' : match[0])}`;
    });
  }

  return str;
}

/**
 * Translator creator
 */
export function createTranslator(lang: string) {
  return (key: string, args?: TranslateArgs) => trans(lang, key, args);
}

/**
 * Returns translate
 */
function getTranslate(locale: string, key: string): string {
  if (key in localization[locale]) {
    return localization[locale][key];
  }
  const { noTranslatePrefix } = _options;
  return noTranslatePrefix ? noTranslatePrefix + key : key;
}

/**
 * Context creator
 */
function createContext(value: string): void {
  LocalizationContext = React.createContext(value);
}

/**
 * Context provider
 */
export const LocalizationProvider: React.FC<Props> = ({ children, value }) => {
  if (!LocalizationContext && value) {
    createContext(value);
  }
  if (LocalizationContext) {
    return (
      <LocalizationContext.Provider value={value}>
        {children}
      </LocalizationContext.Provider>
    );
  }
  return null;
};

/**
 * Returns translator
 */
export function useTranslator(): Translator {
  const value = useContext(LocalizationContext);
  return useCallback(createTranslator(value), [value]);
}

/**
 * Returns current language
 */
export function useLanguage(): string {
  return useContext(LocalizationContext);
}
