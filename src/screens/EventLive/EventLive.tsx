import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { AccountPlanTierGridSection } from "./sections/AccountPlanTierGridSection";
import { EventPromotionHeroSection } from "./sections/EventPromotionHeroSection";
import { ArrowRight, CheckCircle2, ChevronDown, Menu, X } from "lucide-react";
import { api, type Challenge } from "../../lib/api";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useTranslation } from "../../lib/i18n";

/* ── Shared constants ── */
const mobileNavTabs = [
  { labelKey: "nav.new_challenge", route: "/challenge" },
  { labelKey: "nav.accounts", route: "/accounts" },
  { labelKey: "nav.payments", route: "/payments" },
  { labelKey: "nav.withdrawals", route: "/withdrawals" },
];

const featureKeys = [
  "feature.2step",
  "feature.unlimited",
  "feature.profit_split",
  "feature.fee",
  "feature.cryptos",
  "feature.leverage",
];

function NeedAssistance() {
  const { t } = useTranslation();
  return (
  <div className="mt-4 md:mt-6 rounded-xl border border-[#163e4a]/40 bg-[#08141c]/60 p-4 md:p-6">
    <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-400">{t("sidebar.need_assistance")}</p>
    <div>
      <button className="w-full h-10 md:h-14 rounded-xl bg-[#00FFA3] text-xs md:text-sm font-bold text-black">{t("sidebar.contact_support")}</button>
    </div>
  </div>
);
}

export const EventLive = (): JSX.Element => {
  const [plans, setPlans] = useState<Challenge[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    api.challenges()
      .then(setPlans)
      .catch(() => setPlans([]));
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-plan-slide]"));
    if (!slides.length) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - containerCenter);
      if (d < closestDist) { closestDist = d; closestIdx = i; }
    });
    setActiveCard(closestIdx);
  };

  const isMobileTabActive = (route: string) =>
    location.pathname.startsWith(route) || (route === "/challenge" && location.pathname === "/event-live");

  return (<>
    <div className="xl:hidden min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white overflow-x-hidden flex flex-col">
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#05070A]/95 px-3 backdrop-blur-md min-[375px]:px-4">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-6 w-auto object-contain min-[375px]:h-7" />
        </Link>
        <div className="flex items-center gap-2 min-[375px]:gap-3">
          <LanguageSwitcher size="sm" />
          <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px]">
            {t("trading.start")}
          </Link>
          <button onClick={() => setSidebarOpen((p) => !p)} className="text-gray-300 hover:text-white" aria-label="Toggle menu">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Horizontal Nav Tabs ── */}
      <nav className="flex overflow-x-auto border-b border-[#1a2a32]/60 bg-[#05070A] px-3 min-[375px]:px-4 md:px-8" style={{ scrollbarWidth: "none" }}>
        {mobileNavTabs.map((tab) => {
          const isActive = isMobileTabActive(tab.route);
          return (
            <Link
              key={tab.route}
              to={tab.route}
              className={`whitespace-nowrap px-3 py-3 text-[12px] font-medium transition-colors border-b-2 min-[375px]:text-[13px] md:text-sm ${
                isActive
                  ? "border-[#00FFA3] text-[#00FFA3]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {t(tab.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* ── Page Content ── */}
      <div className="flex-1 flex flex-col relative">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-8 lg:px-12 flex-1 flex flex-col gap-4 md:gap-6 md:justify-between">

          {/* ── Event Banner ── */}
          <section className="relative overflow-hidden rounded-[20px] border border-[#00FFA3]/45 bg-[linear-gradient(135deg,rgba(19,86,70,0.88)_0%,rgba(9,30,33,0.95)_92%)] px-3.5 py-4 shadow-[0_0_0_1px_rgba(0,255,163,0.06)] min-[375px]:rounded-[22px] min-[375px]:px-4 min-[375px]:py-5 md:rounded-3xl md:px-8 md:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(0,255,163,0.10),transparent_42%)] opacity-80" />
            <div className="relative z-10 mb-2.5 flex items-center gap-2 min-[375px]:mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00FFA3] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#021a14] min-[375px]:gap-1.5 min-[375px]:px-2.5 min-[375px]:text-[9px] md:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#021a14]" />
                Event Live
              </span>
            </div>
            <h2 className="relative z-10 text-[17px] font-black leading-[1.08] tracking-tight text-white min-[375px]:text-[18px] md:text-3xl lg:text-4xl">
              {t("event.title_line1")}
              <br />
              {t("event.title_line2")}
            </h2>
            <p className="relative z-10 mt-2 text-[9px] leading-[1.55] text-[#c9d6db]/72 min-[375px]:text-[10px] md:mt-3 md:text-sm">
              {t("event.description")}
            </p>
            <Link
              to="/event-live"
              className="relative z-10 mt-4 inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-[#00FFA3] px-3.5 text-[11px] font-bold text-black transition-all hover:bg-[#00e895] min-[375px]:h-9 min-[375px]:px-4 min-[375px]:text-[12px] md:mt-6 md:h-11 md:px-6 md:text-base"
            >
              {t("event.read_rules")} <ArrowRight size={13} />
            </Link>
          </section>

          {/* ── Plan Carousel ── */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-3 min-[375px]:-mx-4 md:-mx-8 lg:-mx-12"
            style={{
              paddingInline: "max(0.75rem, calc(50vw - clamp(160px, 57vw, 220px) / 2))",
              scrollPaddingInline: "max(0.75rem, calc(50vw - clamp(160px, 57vw, 220px) / 2))",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {plans.map((plan) => {
              const isPro = plan.id.toLowerCase().includes("killer");

              return (
                <div
                  key={plan.id}
                  data-plan-slide
                  className="flex shrink-0 snap-center flex-col gap-2.5 min-[375px]:gap-3"
                  style={{ width: "clamp(160px, 57vw, 220px)" }}
                >
                  <article
                    className={`relative min-h-[270px] rounded-[20px] border px-4 pb-4 pt-3.5 transition-all min-[375px]:min-h-[283px] min-[375px]:rounded-[22px] min-[375px]:px-5 min-[375px]:pb-5 min-[375px]:pt-4 md:min-h-[400px] md:px-6 md:pb-6 md:pt-5 ${
                      isPro
                        ? "border-[#00FFA3]/70 bg-[#081018] shadow-[0_0_24px_rgba(0,255,163,0.12)]"
                        : "border-[#1d242c] bg-[#0b1016]"
                    }`}
                  >
                    <div className="mb-4 min-[375px]:mb-5">
                      <h3 className={`mb-3 text-[10px] font-bold uppercase tracking-[0.2em] min-[375px]:mb-4 min-[375px]:text-[11px] ${isPro ? "text-[#00FFA3]" : "text-[#97aab2]"}`}>
                        {plan.name.toUpperCase()}
                      </h3>
                      <span className="text-[16px] font-black leading-none text-white min-[375px]:text-[18px]">
                        ${plan.balance.toLocaleString()}
                      </span>
                      <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-[#586b74] min-[375px]:text-[9px]">
                        {t("event.account_balance")}
                      </span>
                    </div>
                    <div className="space-y-2.5 min-[375px]:space-y-3">
                      {featureKeys.map((featureKey, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="shrink-0 text-[#00FFA3]" />
                          <span className="text-[10px] font-medium leading-tight text-[#95a7af] min-[375px]:text-[11px]">{t(featureKey)}</span>
                        </div>
                      ))}
                    </div>
                    {isPro && (
                      <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                        <span className="rounded-full bg-[#00FFA3] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-black whitespace-nowrap min-[375px]:px-3 min-[375px]:text-[9px]">
                          {t("pricing.most_popular")}
                        </span>
                      </div>
                    )}
                  </article>

                  <div
                    className={`rounded-[16px] border p-2.5 min-[375px]:rounded-[18px] min-[375px]:p-3 ${
                      isPro ? "border-[#00FFA3]/30 bg-[#0d141a]/95" : "border-[#1d242c] bg-[#0b1016]/92"
                    }`}
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2 min-[375px]:mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-[0.16em] min-[375px]:text-[10px] ${isPro ? "text-[#00FFA3]" : "text-[#6f8189]"}`}>
                        {plan.name.toUpperCase()}
                      </span>
                      <span className="text-[16px] font-black leading-none text-white min-[375px]:text-[18px]">${plan.fee}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 min-[375px]:gap-2">
                      <Link
                        to={`/checkout/${plan.id}?method=crypto`}
                        className="flex h-9 w-full items-center justify-center rounded-[10px] bg-[#00FFA3] px-2 text-[10px] font-black uppercase tracking-[0.03em] text-black transition-all hover:bg-[#00e895] min-[375px]:h-10 min-[375px]:px-3 min-[375px]:text-[11px]"
                      >
                        {t("event.crypto_payment")}
                      </Link>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Carousel dots ── */}
          <div className="flex justify-center gap-1.5">
            {plans.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === activeCard ? "bg-[#00FFA3]" : "bg-[#38464d]"}`}
              />
            ))}
          </div>

          <NeedAssistance />
        </div>
      </div>
    </div>
    <div className="hidden xl:block">
      <DashboardLayout>
        <div className="px-0">
          <EventPromotionHeroSection />
          <AccountPlanTierGridSection plans={plans} />
        </div>
      </DashboardLayout>
    </div>
  </>
  );
};
