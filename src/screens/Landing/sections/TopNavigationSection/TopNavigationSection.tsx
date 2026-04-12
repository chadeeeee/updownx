import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../lib/auth";
import { LanguageSwitcher } from "../../../../components/LanguageSwitcher";
import { useTranslation } from "../../../../lib/i18n";

const navLinkKeys = [
  { key: "nav.challenges", href: "#challenges" },
  { key: "nav.affiliate", href: "#affiliate" },
  { key: "nav.faq", href: "#faq" },
  { key: "nav.blog", href: "#blog" },
];

const mobileNavLinkKeys = [
  { key: "nav.home", href: "/", isActive: true },
  { key: "nav.challenge", href: "#challenges" },
  { key: "nav.affiliate", href: "#affiliate" },
  { key: "nav.faq", href: "#faq" },
  { key: "nav.blog", href: "#blog" },
  { key: "nav.help", href: "#help" },
];

export const TopNavigationSection = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#2cf6c3] bg-[#0b0f14]/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-[30px]">
        <Link to="/" className="flex items-center p-1 sm:p-2">
          <img
            className="h-8 w-auto object-contain sm:h-[40.29px]"
            alt="Logo"
            src="/images/logo.png"
          />
        </Link>

        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
          {navLinkKeys.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 tracking-[0] text-gray-400 transition-colors hover:text-[#00ffa3]"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />

          {user ? (
            <button
              className="h-auto rounded-full border border-solid border-[#1e262f] bg-transparent px-5 py-2 text-sm text-[#00ffa3] hover:bg-[#1e262f]"
              onClick={() => navigate("/accounts")}
            >
              {user.name}
            </button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-full border border-solid border-[#1e262f] bg-transparent px-5 py-2 text-sm font-normal leading-5 whitespace-nowrap text-white hover:bg-[#1e262f] hover:text-white"
            >
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
          )}

          <Button
            asChild
            className="h-auto rounded-full border-none bg-[#00ffa3] px-5 py-2 text-sm font-bold leading-5 whitespace-nowrap text-[#05070a] hover:bg-[#00e691]"
          >
            <Link to={user ? "/challenge" : "/login"}>{t("nav.start_challenge")}</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1e262f] bg-[#11161d] lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className="block h-0.5 w-full rounded-full bg-white" />
            <span className="block h-0.5 w-full rounded-full bg-white" />
            <span className="block h-0.5 w-full rounded-full bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile menu - always rendered, animated with CSS */}
      <div className="lg:hidden">
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out"
          style={{
            opacity: isMenuOpen ? 1 : 0,
            pointerEvents: isMenuOpen ? 'auto' : 'none',
          }}
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Panel */}
        <div
          id="mobile-nav"
          className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col bg-[#0b0f14] px-5 pb-6 pt-5 transition-transform duration-500 ease-in-out"
          style={{
            transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
          }}
        >
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <img
              className="h-8 w-auto object-contain"
              alt="Logo"
              src="/images/logo.png"
            />
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Nav links - centered, no borders */}
          <div className="mb-8 flex flex-col items-center gap-2">
            {mobileNavLinkKeys.map((link, index) => (
              <a
                key={link.key}
                href={link.href}
                className={`[font-family:'Inter',Helvetica] w-[260px] rounded-xl py-3 text-center text-base font-semibold transition-all duration-300 ${
                  link.isActive
                    ? 'bg-[#00ffa3] text-[#05070a]'
                    : 'text-white hover:text-[#00ffa3]'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${100 + index * 50}ms` : '0ms',
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-3">
            {/* Login & Start Challenge buttons */}
            <div className="flex flex-col gap-3 mx-auto w-[260px]">
              {user ? (
                <button
                  className="h-12 rounded-xl border border-solid border-[#1e262f] bg-transparent text-sm font-semibold text-[#00ffa3] hover:bg-[#1e262f]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/accounts");
                  }}
                >
                  {user.name}
                </button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border border-solid border-[#1e262f] bg-transparent text-sm font-semibold text-white hover:bg-[#1e262f] hover:text-white"
                >
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    {t("nav.login")}
                  </Link>
                </Button>
              )}

              <Button
                asChild
                className="h-12 rounded-xl border-none bg-[#00ffa3] text-sm font-bold text-[#05070a] hover:bg-[#00e691]"
              >
                <Link
                  to={user ? "/challenge" : "/login"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.start_challenge")}
                </Link>
              </Button>
            </div>

            {/* Need assistance block */}
            <div
              className={`
                mx-auto mt-4 relative w-[224px] h-[90px] flex flex-col items-start justify-center gap-2 px-4 rounded-xl
                bg-[linear-gradient(211deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
                before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl
                before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
                before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none
              `}
            >
              <span className="[font-family:'Inter',Helvetica] text-[13px] font-normal text-white leading-5 z-10 relative">
                {t("sidebar.need_assistance")}
              </span>
              <Button
                asChild
                className="h-9 w-full rounded-[10px] border-none bg-[#00ffa3] [font-family:'Inter',Helvetica] text-[11.1px] font-[600] leading-[16px] text-[#0B0F14] hover:bg-[#00e691] z-10 relative"
              >
                <a href="#help" onClick={() => setIsMenuOpen(false)}>
                  {t("sidebar.contact_support")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
