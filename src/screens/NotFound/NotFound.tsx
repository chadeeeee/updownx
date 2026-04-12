import { Link } from "react-router-dom";
import { useTranslation } from "../../lib/i18n";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export const NotFound = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <main className="relative flex min-h-screen flex-col bg-[#02060c] text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-[#2cf6c3] bg-[#0b0f14]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-[30px]">
          <Link to="/" className="flex items-center">
            <img className="h-8 w-auto object-contain sm:h-[40.29px]" alt="Logo" src="/images/logo.png" />
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Content */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        {/* BG texture */}
        <img
          src="/images/bg-lines.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <img
          src="/images/bg-lines1.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
        />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00ffa3]/8 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00ffa3]/6 blur-[120px]" />

        <section className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center px-5 text-center">
        {/* Chart icon card */}
        <div className="mb-4 flex h-[120px] w-[180px] items-end justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#0e3d43]/80 to-[#082a30]/60 p-5 shadow-[0_8px_32px_rgba(0,255,163,0.08)]">
          <div className="h-[50px] w-[14px] rounded-sm bg-[#00ffa3]/70" />
          <div className="h-[70px] w-[14px] rounded-sm bg-[#00ffa3]" />
          <div className="h-[40px] w-[14px] rounded-sm bg-[#ff4d4d]/80" />
          <div className="h-[55px] w-[14px] rounded-sm bg-[#ff4d4d]" />
          <div className="h-[65px] w-[14px] rounded-sm bg-[#00ffa3]" />
          <div className="h-[30px] w-[14px] rounded-sm bg-[#00ffa3]/60" />
        </div>

        {/* Trend icon */}
        <svg
          className="mb-6 text-[#00ffa3]"
          width="40"
          height="28"
          viewBox="0 0 40 28"
          fill="none"
        >
          <path
            d="M2 22L12 12L18 18L28 6M28 6H22M28 6V12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
          <path d="M37 23L39 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <h1 className="text-[42px] font-bold leading-tight tracking-tight whitespace-pre-line">
          {t("page.not_available_title")}
        </h1>

        <p className="mt-4 max-w-[460px] text-base leading-relaxed text-[#6e8188] whitespace-pre-line">
          {t("page.not_available_desc")}
        </p>

        <Link
          to="/challenge"
          className="mt-10 inline-block rounded-xl bg-[#00FFA3] px-10 py-3.5 text-lg font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
        >
          {t("page.new_challenge")}
        </Link>
        </section>
      </div>
    </main>
  );
};
