import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api, type Challenge } from "../../lib/api";
import { ArrowRight, CheckCircle2, ChevronDown, Menu, X } from "lucide-react";

/* ── Shared constants ── */
const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];

const features = [
  "2 Step Assessment",
  "Unlimited Trading",
  "Up to 80% Profit Split",
  "Challenge Fee",
  "160+ Cryptos",
  "1:5 Leverage",
];

const NeedAssistance = () => (
  <div className="mt-4 rounded-[18px] border border-[#1a5a4a]/50 bg-[linear-gradient(180deg,rgba(15,56,50,0.92)_0%,rgba(8,20,27,0.92)_100%)] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.22)] min-[375px]:rounded-[20px] min-[375px]:p-4 md:mt-6 md:p-6">
    <p className="mb-2.5 text-[11px] text-[#d7e4e0] min-[375px]:mb-3 min-[375px]:text-xs md:mb-4 md:text-sm">Need assistance?</p>
    <div className="grid grid-cols-2 gap-2 min-[375px]:gap-2.5 md:gap-4">
      <button className="h-9 rounded-[10px] bg-[#00FFA3] px-2 text-[11px] font-bold text-black min-[375px]:h-10 min-[375px]:rounded-xl min-[375px]:text-xs md:h-14 md:text-sm">Contact Support</button>
      <button className="h-9 rounded-[10px] border border-[#2f7563] bg-transparent px-2 text-[11px] font-bold text-[#c3d8d0] min-[375px]:h-10 min-[375px]:rounded-xl min-[375px]:text-xs md:h-14 md:text-sm">Help</button>
    </div>
  </div>
);

export const NewChallenge = (): JSX.Element => {
  const [plans, setPlans] = useState<Challenge[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveCard(closestIndex);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || plans.length === 0) return;

    const initialIndex = Math.min(1, plans.length - 1);
    const frame = requestAnimationFrame(() => {
      const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-plan-slide]"));
      const activeSlide = slides[initialIndex];
      if (!activeSlide) return;

      el.scrollLeft = activeSlide.offsetLeft - (el.clientWidth - activeSlide.offsetWidth) / 2;
      setActiveCard(initialIndex);
    });

    return () => cancelAnimationFrame(frame);
  }, [plans.length]);

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
          <button className="flex items-center gap-1 text-[11px] text-gray-400 min-[375px]:text-xs">
            EN <ChevronDown size={10} />
          </button>
          <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px]">
            START
          </Link>
          <button onClick={() => setSidebarOpen((p) => !p)} className="text-gray-300 hover:text-white" aria-label="Toggle menu">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Horizontal Nav Tabs (shown when hamburger is open) ── */}
      {sidebarOpen && <nav className="flex justify-center overflow-x-auto scrollbar-hide border-b border-[#1a2a32]/60 bg-[#05070A] px-2 py-2 min-[375px]:px-3 min-[375px]:py-3 md:px-6 md:py-4">
        <div className="flex shrink-0 gap-0.5 rounded-[13px] border border-[#12313a] bg-[#081018]/80 px-1 py-1 min-[375px]:gap-0.5 min-[375px]:rounded-[16px] min-[375px]:px-1.5 min-[375px]:py-1.5 min-[400px]:gap-1 min-[400px]:rounded-[18px] min-[400px]:px-2 md:gap-2 md:rounded-[22px] md:px-3 md:py-2">
          {mobileNavTabs.map((tab) => {
            const isActive = isMobileTabActive(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                className={`relative whitespace-nowrap rounded-lg px-2 py-1.5 text-[9px] font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-2.5 min-[375px]:py-2 min-[375px]:text-[11px] min-[400px]:px-3 min-[400px]:text-[12px] md:rounded-2xl md:px-5 md:py-3 md:text-sm lg:px-6 lg:text-base ${
                  isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 ${
                    isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>}

      {/* ── Page Content ── */}
      <div className="flex-1 flex flex-col relative">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-8 lg:px-12 flex-1 flex flex-col gap-4 md:gap-6 md:justify-between">

          {/* ── Event Banner ── */}
          <section className="relative overflow-hidden rounded-[20px] border border-[#00FFA3]/45 bg-[linear-gradient(135deg,rgba(19,86,70,0.88)_0%,rgba(9,30,33,0.95)_92%)] px-3.5 py-4.5 shadow-[0_0_0_1px_rgba(0,255,163,0.06)] min-[375px]:rounded-[22px] min-[375px]:px-4 min-[375px]:py-5 md:rounded-3xl md:px-8 md:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(0,255,163,0.10),transparent_42%)] opacity-80" />
            <div className="relative z-10 mb-2.5 flex items-center gap-2 min-[375px]:mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00FFA3] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#021a14] min-[375px]:gap-1.5 min-[375px]:px-2.5 min-[375px]:text-[9px] md:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#021a14]" />
                Event Live
              </span>
            </div>
            <h2 className="relative z-10 max-w-[235px] text-[17px] font-black leading-[1.08] tracking-tight text-white min-[375px]:max-w-[260px] min-[375px]:text-[18px] md:max-w-2xl md:text-3xl lg:text-4xl">
              WSCT Blockchain Forum 2026 –
              <br />
              Qualifying Tour
            </h2>
            <p className="relative z-10 mt-2 max-w-[230px] text-[9px] leading-[1.55] text-[#c9d6db]/72 min-[375px]:max-w-[255px] min-[375px]:text-[10px] md:mt-3 md:max-w-2xl md:text-sm">
              Join the elite circle of institutional-grade traders. Complete the qualifying assessment
              during the WSCT Forum and gain access to a dedicated $1M pool.
            </p>
            <Link
              to="/event-live"
              className="relative z-10 mt-4 inline-flex h-8.5 items-center gap-1.5 rounded-[10px] bg-[#00FFA3] px-3.5 text-[11px] font-bold text-black transition-all hover:bg-[#00e895] min-[375px]:h-9 min-[375px]:px-4 min-[375px]:text-[12px] md:mt-6 md:h-11 md:px-6 md:text-base"
            >
              Read the rules <ArrowRight size={13} />
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
              const isPro = plan.id.toLowerCase().includes("pro");
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
                      <h3 className={`mb-3 text-[10px] font-bold uppercase tracking-[0.2em] min-[375px]:mb-4 min-[375px]:text-[11px] min-[375px]:tracking-[0.22em] ${isPro ? "text-[#00FFA3]" : "text-[#97aab2]"}`}>
                        {plan.name}
                      </h3>
                      <span className="text-[16px] font-black leading-none text-white min-[375px]:text-[18px] md:text-3xl">
                        ${plan.balance.toLocaleString()}
                      </span>
                      <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-[#586b74] min-[375px]:text-[9px] min-[375px]:tracking-[0.18em]">
                        Account Balance
                      </span>
                    </div>

                    <div className="space-y-2.5 min-[375px]:space-y-3">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="shrink-0 text-[#00FFA3] min-[375px]:h-[13px] min-[375px]:w-[13px]" />
                          <span className="text-[10px] font-medium leading-tight text-[#95a7af] min-[375px]:text-[11px]">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {isPro && (
                      <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                        <span className="rounded-full bg-[#00FFA3] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-black whitespace-nowrap min-[375px]:px-3 min-[375px]:text-[9px] min-[375px]:tracking-[0.18em]">
                          Most Popular
                        </span>
                      </div>
                    )}
                  </article>

                  <div
                    className={`rounded-[16px] border p-2.5 min-[375px]:rounded-[18px] min-[375px]:p-3 ${
                      isPro
                        ? "border-[#00FFA3]/30 bg-[#0d141a]/95"
                        : "border-[#1d242c] bg-[#0b1016]/92"
                    }`}
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2 min-[375px]:mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-[0.16em] min-[375px]:text-[10px] min-[375px]:tracking-[0.18em] ${isPro ? "text-[#00FFA3]" : "text-[#6f8189]"}`}>
                        {plan.name}
                      </span>
                      <span className="text-[16px] font-black leading-none text-white min-[375px]:text-[18px]">${plan.fee}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 min-[375px]:gap-2">
                      <Link
                        to={`/checkout/${plan.id}?method=crypto`}
                        className="flex h-9 w-full items-center justify-center rounded-[10px] bg-[#00FFA3] px-2 text-[10px] font-black uppercase tracking-[0.03em] text-black transition-all hover:bg-[#00e895] min-[375px]:h-10 min-[375px]:px-3 min-[375px]:text-[11px] min-[375px]:tracking-[0.04em]"
                      >
                        Crypto Payment
                      </Link>
                      <Link
                        to={`/checkout/${plan.id}?method=pix`}
                        className="flex h-9 w-full items-center justify-center rounded-[10px] border border-[#1f2c34] bg-transparent px-2 text-[10px] font-bold uppercase tracking-[0.03em] text-white/90 transition-all hover:bg-white/5 min-[375px]:h-10 min-[375px]:px-3 min-[375px]:text-[11px] min-[375px]:tracking-[0.04em]"
                      >
                        PIX
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Carousel dots ── */}
          {plans.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {plans.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === activeCard ? "bg-[#00FFA3]" : "bg-[#38464d]"}`}
                />
              ))}
            </div>
          )}

          <NeedAssistance />
        </div>
      </div>
    </div>
    <div className="hidden xl:block">
      <DashboardLayout>
        {/* Event banner */}
        <section className="mb-12 rounded-3xl border border-[#1e5e5c]/50 bg-gradient-to-br from-[#0e3b3f]/50 to-[#061e22]/50 p-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00FFA3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#021a14]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#021a14]" />
              Event Live
            </span>
          </div>
          <h2 className="text-4xl font-black leading-tight tracking-tight text-white">
            WSCT Blockchain Forum 2026 –
            <br />
            Qualifying Tour
          </h2>
          <p className="mt-3 max-w-2xl text-[#89a4ad]">
            Join the elite circle of institutional-grade traders. Complete the qualifying assessment
            during the WSCT Forum and gain access to a dedicated $1M pool.
          </p>
          <Link
            to="/event-live"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00FFA3] px-6 py-3 font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.2)]"
          >
            Read the rules <ArrowRight size={16} />
          </Link>
        </section>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 items-start">
          {plans.map((plan) => {
            const isPro = plan.id.toLowerCase().includes("pro");

            return (
              <div key={plan.id} className="flex flex-col gap-4">
                <article
                  className={`relative flex flex-col rounded-[24px] border p-6 transition-all min-h-[420px] ${
                    isPro
                      ? "border-[#00FFA3] bg-[#020b11] ring-1 ring-[#00FFA3]"
                      : "border-[#1a242c] bg-[#0d141a]"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="rounded-full bg-[#00FFA3] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-black whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className={`text-[12px] font-bold uppercase tracking-[0.2em] mb-4 ${isPro ? 'text-[#00FFA3]' : 'text-[#8ea4ad]'}`}>
                      {plan.name}
                    </h3>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-white">
                        ${plan.balance.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#5e747e] tracking-widest mt-1">
                        Account Balance
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#00FFA3] shrink-0" />
                        <span className="text-[13px] text-[#8ea4ad] font-medium leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-[#42555e] tracking-widest">
                      {plan.name}
                    </span>
                    <span className="text-xl font-black text-white leading-none mt-1">
                      ${plan.fee}
                    </span>
                  </div>
                  <Link
                    to={`/checkout/${plan.id}?method=crypto`}
                    className="group flex w-full items-center justify-center rounded-xl bg-[#00FFA3] py-3.5 text-[13px] font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_15px_rgba(0,255,163,0.3)]"
                  >
                    Crypto Payment
                  </Link>
                  <Link
                    to={`/checkout/${plan.id}?method=pix`}
                    className="flex w-full items-center justify-center rounded-xl border border-[#1a242c] bg-[#0d141a] py-3.5 text-[13px] font-black uppercase tracking-wider text-[#8ea4ad] transition-all hover:bg-[#1a242c] hover:text-white"
                  >
                    PIX
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardLayout>
    </div>
  </>
  );
};
