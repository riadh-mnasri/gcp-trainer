/*
 * Copyright (c) 2026 Riadh MNASRI. All rights reserved.
 *
 * Locale provider. The locale is a client-side preference persisted in
 * localStorage; the whole app re-renders instantly when it changes.
 */
"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/content/types";
import { useHydratedState } from "@/lib/hooks/useHydratedState";
import { dictionaries, type UiKey } from "./dictionaries";

const STORAGE_KEY = "gcptrainer.locale";

function getPersistedLocale(): Locale {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "fr" ? saved : "en";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translates a UI key using the active dictionary. */
  t: (key: UiKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useHydratedState(getPersistedLocale, "en" as Locale);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    },
    [setLocaleState]
  );

  const t = useCallback(
    (key: UiKey) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
