import { useState, useRef, useEffect } from "react";
import { useTranslation, LANGUAGES } from "../lib/i18n";

interface Props {
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
}

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

  const flag = LANGUAGES.find((l) => l.code === lang)?.flag ?? "🇬🇧";
  const textCls = size === "sm" ? "text-[10px] min-[375px]:text-[11px] md:text-sm" : "text-xs";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className={`flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80 text-gray-400 ${textCls}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{flag}</span>
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
              <span className="text-sm">{l.flag}</span>
              <span className="text-xs font-semibold">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
