import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "en" | "uk" | "ru" | "hi" | "kk";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
];

/* ── Translation dictionaries ── */
import { en } from "./translations/en";
import { uk } from "./translations/uk";
import { ru } from "./translations/ru";
import { hi } from "./translations/hi";
import { kk } from "./translations/kk";

const dictionaries: Record<Lang, Record<string, string>> = { en, uk, ru, hi, kk };

/* ── Context ── */
type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export const useTranslation = () => useContext(I18nContext);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("updownx_lang") as Lang | null;
      if (saved && dictionaries[saved]) return saved;
    } catch {}
    return "en";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("updownx_lang", l); } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    return dictionaries[lang]?.[key] ?? dictionaries.en?.[key] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
