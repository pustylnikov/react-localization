import React, { useContext, useCallback } from 'react';

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

export type Translator = (locale: string, key: string, ...args: Array<any>) => string

let localization: Translates = {};
let _options: Options = {};
let LocalizationContext: React.Context<string | undefined> | null = null;

/**
 * Set localization data
 *
 * @param data
 */
export function setLocalizations(data: Translates): void {
    localization = data;
}

export function setOptions(options: Options): void {
    _options = options;
}

/**
 * Returns translate string
 *
 * @param locale
 * @param key
 * @param args
 */
export function trans(locale: string, key: string, ...args: Array<any>): string {
    const str = getTranslate(locale, key);
    let i = 0;
    return str.replace(/%?%s/g, function (s: string) {
        if (s === '%%s') {
            return '%s';
        }
        const replace = i in args ? args[i] : s;
        ++i;
        return replace;
    });
}

/**
 * Translator creator
 *
 * @param lang
 */
export function createTranslator(lang: string) {
    return function (key: string, ...args: Array<any>) {
        return trans(lang, key, ...args);
    };
}

/**
 * Returns translate
 * @param locale
 * @param key
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
function createContext(value?: string): void {
    LocalizationContext = React.createContext(value);
}

/**
 * Context provider
 *
 * @param children
 * @param value
 * @constructor
 */
export const LocalizationProvider: React.FC<Props> = ({ children, value }) => {
    if (!LocalizationContext) {
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
export function useTranslator(): Translator | void {
    if (LocalizationContext) {
        const value = useContext(LocalizationContext);
        if (value) {
            return useCallback(createTranslator(value), [value]);
        }
    }
}

/**
 * Returns current language
 */
export function useLanguage(): string | void {
    if (LocalizationContext) {
        return useContext(LocalizationContext);
    }
}
