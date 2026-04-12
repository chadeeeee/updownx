import { useState, useRef, useEffect } from "react";
import { useTranslation, LANGUAGES, Lang } from "../lib/i18n";
import Flag from "react-world-flags";

interface Props {
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
}

const COUNTRY_CODES: Record<Lang, string> = {
  en: "gb",
  uk: "ua",
  ru: "ru",
  hi: "in",
  kk: "kz",
};

export const LanguageSwitcher = ({ className = "", size = "md" }: Props) => {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const textCls = size === "sm" ? "text-[10px] min-[375px]:text-[11px] md:text-sm" : "text-xs";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className={`flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80 text-gray-400 ${textCls}`}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="overflow-hidden rounded-sm flex-shrink-0 w-5 h-4 flex items-center justify-center">
          <Flag code={COUNTRY_CODES[lang]} width={20} height={15} />
        </div>
        <span className="font-bold">{lang.toUpperCase()}</span>
        <svg className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-[#0b0f14] border border-white/10 rounded-xl shadow-2xl z-[300] py-1 min-w-[150px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left bg-transparent border-none cursor-pointer transition-colors hover:bg-white/5 ${lang === l.code ? "text-[#00ffa3]" : "text-gray-300"}`}
            >
              <div className="overflow-hidden rounded-sm flex-shrink-0 w-5 h-4 flex items-center justify-center">
                <Flag code={COUNTRY_CODES[l.code]} width={18} height={13} />
              </div>
              <span className="text-xs font-semibold">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
