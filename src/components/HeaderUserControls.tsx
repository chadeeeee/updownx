import { Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { useTranslation, LANGUAGES } from "../lib/i18n";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const HeaderUserControls = (): JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const displayName = user?.name ?? "Trader";
  const initials = getInitials(displayName);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" ref={langRef}>
        <button
          className="inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => setLangOpen((o) => !o)}
        >
          <Globe className="h-[14px] w-[14px] text-gray-300" />
          <span className="[font-family:'Inter',Helvetica] font-bold text-gray-300 text-xs tracking-[0] leading-4 whitespace-nowrap">
            {lang.toUpperCase()}
          </span>
          <img className="w-4 h-4" alt="" src="/svg/arrow.svg" />
        </button>
        {langOpen && (
          <div className="absolute top-full right-0 mt-1 bg-[#0b0f14] border border-white/10 rounded-xl shadow-2xl z-[300] py-1 min-w-[160px]">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setLangOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left bg-transparent border-none cursor-pointer transition-colors hover:bg-white/5 ${lang === l.code ? "text-[#00ffa3]" : "text-gray-300"}`}
              >
                <span className="text-sm">{l.flag}</span>
                <span className="text-xs font-semibold">{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="relative flex items-center justify-center bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
        aria-label="Notifications"
      >
        <img className="h-[18px] w-[18px]" alt="Notifications" src="/svg/bell.svg" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00FFA3]" />
      </button>

      <Link to="/accounts" className="inline-flex items-center gap-3">
        <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-[11.4px] text-right tracking-[-0.40px] leading-4 whitespace-nowrap">
          {displayName}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ffa3]">
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#0b0f14] text-xs tracking-[0] leading-4 whitespace-nowrap">
            {initials}
          </span>
        </div>
      </Link>

      <button
        className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
        onClick={() => {
          logout();
          navigate("/");
        }}
        aria-label="Log out"
      >
        <img className="w-[18px] h-[16px]" alt="Log out" src="/svg/button-log-out.svg" />
      </button>
    </div>
  );
};
