"use client";

// ============================================================
// AgriShield — Language Context
// Provides language selection across the entire app.
// Persists in localStorage. Falls back to "en-IN".
// ============================================================

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { type AppLang, getTranslation } from "@/lib/i18n/translations";

const STORAGE_KEY = "agrishield-lang";
const DEFAULT_LANG: AppLang = "en-IN";
const VALID_LANGS: AppLang[] = ["en-IN", "hi-IN", "te-IN"];

interface LanguageContextValue {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => getTranslation(DEFAULT_LANG, key),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLang>(DEFAULT_LANG);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AppLang | null;
      if (stored && VALID_LANGS.includes(stored)) {
        setLangState(stored);
      }
    } catch {
      // localStorage not available (SSR or private mode) — use default
    }
  }, []);

  const setLang = useCallback((newLang: AppLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string) => getTranslation(lang, key),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
