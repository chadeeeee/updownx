import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import { CheckoutDetailSection } from "./sections/CheckoutDetailSection/CheckoutDetailSection";
import { LandingSlidebarSubsection } from "./sections/LandingSlidebarSubsection";
import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection";
import { Button } from "../../components/ui/button";

/* ── Mobile nav tabs ── */
const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];

/* ── Gradient border card class (reused from CheckoutDetailSection) ── */
const gradientCardClass =
  "relative bg-[#05070a] rounded-xl border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none";

/* ── Need Assistance footer (mobile) ── */
const NeedAssistance = () => (
  <div className="mt-4 md:mt-6 rounded-xl border border-[#163e4a]/40 bg-[#08141c]/60 p-4 md:p-6">
    <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <button className="h-10 md:h-14 rounded-xl bg-[#00FFA3] text-xs md:text-sm font-bold text-black">Contact Support</button>
      <button className="h-10 md:h-14 rounded-xl border border-[#163e4a] bg-[#0b1820] text-xs md:text-sm font-bold text-white">Help</button>
    </div>
  </div>
);

export const CheckoutLanding = (): JSX.Element => {
  const [mobileStep, setMobileStep] = useState<1 | 2>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  /* ═══════════════════════════════════════════════
     MOBILE LAYOUT (< xl) — fully standalone
     ═══════════════════════════════════════════════ */
  const MobileLayout = () => (
    <div className="xl:hidden min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white overflow-x-hidden flex flex-col">
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#2cf6c3]/30 bg-[#05070A]/95 px-4 backdrop-blur-md">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-gray-400">
            EN <ChevronDown size={10} />
          </button>
          <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-3 py-1.5 text-[11px] font-bold text-black">
            START
          </Link>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-white" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Horizontal Nav Tabs ── */}
      <nav className="flex gap-1 overflow-x-auto border-b border-[#1a2a32]/60 bg-[#05070A] px-4 py-2 scrollbar-hide">
        {mobileNavTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.route);
          return (
            <Link
              key={tab.route}
              to={tab.route}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Sidebar (slide-over, always overlay — no lg breakpoint dependency) ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-40 flex flex-col w-[269px] h-screen items-center justify-between px-0 py-[43px] bg-[#05070a] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col w-[210px] items-start gap-[5px]">
          {mobileNavTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-[210px] items-center gap-1.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-[#01ffa3] pl-[30px] pr-4" : "bg-transparent hover:bg-white/5 px-4"
                }`}
              >
                <span className={`[font-family:'Inter',Helvetica] text-[13.2px] tracking-[0] leading-5 whitespace-nowrap transition-colors ${
                  isActive ? "font-semibold text-[#05070a]" : "font-normal text-gray-300"
                }`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* ── Page Content ── */}
      <div className="flex-1 flex flex-col relative">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-4 md:px-8 lg:px-12 py-5 md:py-8 flex-1 flex flex-col">
          {mobileStep === 1 ? <MobileStep1 /> : <MobileStep2 />}
        </div>
      </div>
    </div>
  );

  /* ── Mobile Step 1: Billing + Payment ── */
  const MobileStep1 = () => (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 flex-1">
      {/* Title + breadcrumb */}
      <div>
        <h1 className="[font-family:'Public_Sans',Helvetica] text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">CHECKOUT</h1>
        <div className="mt-1 md:mt-2 flex items-center gap-1.5 text-xs md:text-sm">
          <Link to="/challenge" className="text-gray-500">New Challenge</Link>
          <span className="text-gray-600">›</span>
          <span className="text-[#00FFA3]">Order Confirmation</span>
        </div>
      </div>

      {/* Billing Details */}
      <div className={`${gradientCardClass} flex flex-col gap-5 md:gap-7 lg:gap-8 w-full p-4 md:p-6 lg:p-8`}>
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/svg/billing-man.svg" alt="" className="h-5 w-5 md:h-6 md:w-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm md:text-lg tracking-[-0.25px]">
            BILLING DETAILS
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[9px] md:text-xs tracking-[1px] leading-3 md:leading-4">FULL NAME</label>
            <div className="flex items-center h-11 md:h-14 lg:h-16 bg-[#0b0f14] rounded-lg border border-[#00ffa333] px-3 md:px-4">
              <input
                value={billingInfo.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-transparent border-none outline-none w-full text-white text-xs md:text-sm"
                placeholder="Alex Stormer"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[9px] md:text-xs tracking-[1px] leading-3 md:leading-4">E-MAIL ADDRESS</label>
            <div className="flex items-center h-11 md:h-14 lg:h-16 bg-[#0b0f14] rounded-lg border border-[#00ffa333] px-3 md:px-4">
              <input
                value={billingInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-transparent border-none outline-none w-full text-white text-xs md:text-sm"
                placeholder="alex.stormer@example.c"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[9px] md:text-xs tracking-[1px] leading-3 md:leading-4">COUNTRY/REGION</label>
            <div className="relative flex items-center h-11 md:h-14 lg:h-16 bg-[#0b0f14] rounded-lg border border-[#00ffa333] px-3 md:px-4">
              <select
                value={billingInfo.country || "UK"}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="bg-transparent border-none outline-none w-full text-white text-xs md:text-sm appearance-none cursor-pointer pr-6"
              >
                <option value="UK">UK</option>
                <option value="US">United States</option>
                <option value="DE">Germany</option>
                <option value="PL">Poland</option>
                <option value="UA">Ukraine</option>
                <option value="BR">Brazil</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#00ffa3]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[9px] md:text-xs tracking-[1px] leading-3 md:leading-4">CITY/TOWN</label>
            <div className="relative flex items-center h-11 md:h-14 lg:h-16 bg-[#0b0f14] rounded-lg border border-[#00ffa333] px-3 md:px-4">
              <select
                value={billingInfo.city || "London"}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="bg-transparent border-none outline-none w-full text-white text-xs md:text-sm appearance-none cursor-pointer pr-6"
              >
                <option value="London">London</option>
                <option value="Manchester">Manchester</option>
                <option value="Birmingham">Birmingham</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#00ffa3]" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className={`${gradientCardClass} flex flex-col gap-4 md:gap-6 w-full p-4 md:p-6 lg:p-8`}>
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/svg/wallet.svg" alt="" className="h-5 w-5 md:h-6 md:w-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm md:text-lg tracking-[-0.25px]">
            PAYMENT METHOD
          </span>
        </div>
        <div className="relative flex items-center gap-3 md:gap-4 h-[72px] md:h-[90px] lg:h-[100px] bg-[#2cf6c30d] rounded-xl border-none p-4 md:p-5 before:content-[''] before:absolute before:inset-0 before:p-[1px] before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border border-[#00ffa333] bg-[#05070a] flex-shrink-0">
            <img src="/svg/btc.svg" alt="BTC" className="w-[14px] h-[18px] md:w-[18px] md:h-[22px]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xs md:text-sm">CRYPTO PAYMENT</p>
            <p className="[font-family:'Public_Sans',Helvetica] text-[10px] md:text-xs text-slate-500">BTC, ETH, USDT, USDC (Fast &amp; Secure)</p>
          </div>
          <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full border-2 border-[#00FFA3] flex-shrink-0 bg-[#00ffa333]">
            <img src="/svg/tick.svg" alt="" className="w-3 h-3 md:w-3.5 md:h-3.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </div>
      </div>

      {/* SSL badge */}
      <div className="flex items-center gap-3 md:gap-4 rounded-xl border border-[#1e3a42]/40 bg-[#050f15]/50 p-3 md:p-5 lg:p-6">
        <div className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#00FFA3]/10 flex-shrink-0">
          <img src="/svg/ssl-secure.svg" alt="" className="w-4 h-5 md:w-5 md:h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div>
          <p className="[font-family:'Public_Sans',Helvetica] text-[11px] md:text-sm font-bold text-white">SSL SECURE PAYMENT</p>
          <p className="[font-family:'Public_Sans',Helvetica] text-[9px] md:text-xs text-gray-500 leading-relaxed">Your information is protected by industry-leading encryption standards.</p>
        </div>
      </div>

      {/* COMPLETE ORDER → go to step 2 */}
      <button
        onClick={() => setMobileStep(2)}
        className="flex h-12 md:h-16 lg:h-18 w-full items-center justify-center rounded-xl md:rounded-2xl bg-[#00FFA3] [font-family:'Public_Sans',Helvetica] text-sm md:text-lg font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895]"
      >
        COMPLETE ORDER
      </button>

      <NeedAssistance />
    </div>
  );

  /* ── Mobile Step 2: Order Summary ── */
  const MobileStep2 = () => (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 flex-1">
      {/* Order card */}
      <div className={`${gradientCardClass} flex flex-col gap-6 md:gap-8 lg:gap-10 w-full p-5 md:p-8 lg:p-10`}>
        <h2 className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl md:text-2xl lg:text-3xl tracking-[-0.5px]">YOUR ORDER</h2>

        {/* Selected plan */}
        <div className="relative flex items-center justify-between h-[70px] md:h-[90px] lg:h-[100px] bg-[#05070a] rounded-lg px-4 md:px-6 before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border border-[#00ffa333] bg-[#0b0f14] flex-shrink-0">
              <img src="/svg/diamond.svg" alt="" className="w-5 h-5 md:w-6 md:h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="min-w-0">
              <p className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm md:text-base">ELITE CHALLENGE</p>
              <p className="[font-family:'Public_Sans',Helvetica] text-[11px] md:text-sm text-slate-500">100K Account Size</p>
            </div>
          </div>
          <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-lg md:text-xl flex-shrink-0">$799.00</span>
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-2.5 md:gap-4 pt-3 md:pt-5" style={{ borderTop: "1px solid", borderImage: "linear-gradient(227deg,rgba(44,246,195,0.3) 0%,rgba(1,50,38,0.3) 100%) 1" }}>
          <div className="flex justify-between text-sm md:text-base">
            <span className="[font-family:'Public_Sans',Helvetica] text-gray-500">Subtotal</span>
            <span className="[font-family:'Public_Sans',Helvetica] font-medium text-white">$799.00</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="[font-family:'Public_Sans',Helvetica] text-gray-500">Platform Fee</span>
            <span className="[font-family:'Public_Sans',Helvetica] font-medium text-[#00ffa3]">Free</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-end justify-between mt-2 md:mt-4">
          <span className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[10px] md:text-xs tracking-[1.2px]">TOTAL AMOUNT</span>
          <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl md:text-4xl">$799.00</span>
        </div>

        {/* COMPLETE ORDER */}
        <Button className="w-full h-14 md:h-16 lg:h-18 bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-2xl [font-family:'Public_Sans',Helvetica] font-black text-slate-950 text-lg md:text-xl tracking-[-0.9px] border-none">
          COMPLETE ORDER
        </Button>

        {/* Privacy */}
        <div className="rounded-lg border border-[#ffffff0d] bg-[#02061780] px-4 md:px-6 py-4 md:py-5">
          <p className="[font-family:'Public_Sans',Helvetica] text-center text-[10px] md:text-xs leading-[1.6] text-gray-500">
            Your personal data will be used to process your order, support
            your experience throughout this website, and for other purposes described in
            our <span className="text-[#2cf6c3] cursor-pointer">Privacy Policy</span>
            . By completing the order, you agree to our Terms of Service.
          </p>
        </div>
      </div>

      <NeedAssistance />
    </div>
  );

  /* ═══════════════════════════════════════════════
     DESKTOP LAYOUT (>= xl) — original design
     ═══════════════════════════════════════════════ */
  const DesktopLayout = () => (
    <div className="hidden xl:block bg-[#05070a] w-full relative overflow-hidden">
      {/* Background images */}
      <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
      <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen" />

      {/* Primary Navigation at the top */}
      <PrimaryNavigationSection />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-row w-full relative">
        {/* Left sidebar */}
        <LandingSlidebarSubsection />

        {/* Right content area */}
        <div className="flex flex-col flex-1 relative">
          {/* Checkout header with breadcrumb */}
          <header className="flex flex-col items-start gap-2 px-8 pt-[36px] pb-2 bg-transparent">
            <div className="w-full h-9 flex items-center">
              <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl tracking-[-0.75px] leading-9">
                CHECKOUT
              </span>
            </div>
            <div className="flex flex-row items-center gap-0 h-5">
              <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                New Challenge
              </span>
              <img className="w-5 h-14 mx-[8px]" alt="Container" src="/svg/arrow-right-another.svg" />
              <span className="[font-family:'Public_Sans',Helvetica] font-normal text-[#00ffa3] text-sm tracking-[0] leading-5 whitespace-nowrap">
                Order Confirmation
              </span>
            </div>
          </header>

          {/* Checkout detail section */}
          <CheckoutDetailSection />
        </div>
      </div>

      {/* Vertical separator line */}
      <img className="fixed top-20 left-[270px] w-px h-[994px] pointer-events-none" alt="Vector" src="/vector-6.svg" />
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
    </>
  );
};
