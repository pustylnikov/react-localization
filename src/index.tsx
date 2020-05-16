import React, { useContext, useCallback } from 'react';
import { createTranslator } from '@anvilapp/localization';

type Props = {
    value: string,
    children: React.ReactNode,
}

export type Translator = (locale: string, key: string, ...args: Array<any>) => string

let LocalizationContext: React.Context<string | undefined> | null = null;

function createContext(value?: string): void {
    LocalizationContext = React.createContext(value);
}

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

export function useTranslator(): Translator | void {
    if (LocalizationContext) {
        const value = useContext(LocalizationContext);
        if (value) {
            return useCallback(createTranslator(value), [value]);
        }
    }
}

export function useLanguage(): string | void {
    if (LocalizationContext) {
        return useContext(LocalizationContext);
    }
}
