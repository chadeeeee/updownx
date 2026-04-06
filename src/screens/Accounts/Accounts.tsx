import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { NavAccountsSubsection } from "./sections/NavAccountsSubsection";
import { MainHedgeModuleSubsection } from "./sections/MainHedgeModuleSubsection";
import { ChevronDown, Menu, X } from "lucide-react";

const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];

const accountTabs = [
  { value: "trader", label: "Trader" },
  { value: "challenge", label: "Challenge" },
  { value: "will-be-actived", label: "Will be actived" },
  { value: "failed", label: "Failed" },
];

const NeedAssistance = () => (
  <div className="mt-4 md:mt-6 rounded-xl border border-[#163e4a]/40 bg-[#08141c]/60 p-4 md:p-6">
    <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <button className="h-10 md:h-14 rounded-xl bg-[#00FFA3] text-xs md:text-sm font-bold text-black">Contact Support</button>
      <button className="h-10 md:h-14 rounded-xl border border-[#163e4a] bg-[#0b1820] text-xs md:text-sm font-bold text-white">Help</button>
    </div>
  </div>
);

export const Accounts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("challenge");
  const location = useLocation();
  const navigate = useNavigate();

  const isMobileTabActive = (route: string) =>
    location.pathname.startsWith(route);

  return (<>
    {/* ═══ MOBILE LAYOUT (< xl) ═══ */}
    <div className="xl:hidden min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white overflow-x-hidden flex flex-col">

      {/* Header */}
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

      {/* Slide-over sidebar (hamburger) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-40 flex flex-col w-[269px] h-screen px-0 py-[43px] bg-[#05070a] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col w-[210px] items-start gap-[5px] ml-4">
          {mobileNavTabs.map((tab) => {
            const isActive = isMobileTabActive(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-[210px] items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-[#01ffa3]" : "bg-transparent hover:bg-white/5"
                }`}
              >
                <span className={`text-[13.2px] leading-5 whitespace-nowrap ${
                  isActive ? "font-semibold text-[#05070a]" : "font-normal text-gray-300"
                }`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main nav — always visible, same underline style as sub-tabs */}
      <nav className="overflow-x-auto scrollbar-hide border-b border-[#1a2a32]/60 bg-[#05070A] px-3 min-[375px]:px-4 md:px-8">
        <div className="flex justify-evenly min-w-max w-full">
          {mobileNavTabs.map((tab) => {
            const isActive = isMobileTabActive(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                className={`relative whitespace-nowrap py-3 px-2 text-[11px] font-medium transition-colors min-[375px]:text-[12px] md:text-sm md:px-3 md:py-4 ${
                  isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-opacity ${isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Account sub-tabs — always visible, centered */}
      <div className="overflow-x-auto scrollbar-hide border-b border-[#1a2a32]/60 bg-[#05070A] px-3 min-[375px]:px-4 md:px-8">
        <div className="flex justify-evenly min-w-max w-full">
          {accountTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative whitespace-nowrap py-3 px-2 text-[11px] font-medium transition-colors min-[375px]:text-[12px] md:text-sm md:px-3 md:py-4 ${
                activeTab === tab.value ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-opacity ${activeTab === tab.value ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col relative">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-8 lg:px-12 flex-1 flex flex-col gap-4 md:gap-6 md:justify-between">

          {/* Trading Identity */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 min-[375px]:text-[10px]">Trading Identity</span>
            <h1 className="text-[22px] font-bold text-white tracking-tight min-[375px]:text-[24px] md:text-3xl">ID: 200050316</h1>
            <p className="text-[10px] text-gray-400 min-[375px]:text-[11px] md:text-sm">Institutional Prop Account • Multi-Asset Environment</p>
          </div>

          {/* Account Card */}
          <div className="relative rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#0a2118_0%,#05110e_100%)] p-4 min-[375px]:p-5 md:p-8 overflow-hidden">
            <img src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png" alt="" className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 flex flex-col gap-4 md:gap-6">

              {/* PRO Card */}
              <div className="w-full max-w-[240px] md:max-w-[280px] h-[120px] md:h-[150px] rounded-xl bg-[linear-gradient(135deg,#13161c_0%,#07080a_100%)] border border-white/10 p-4 md:p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
                <span className="font-black italic text-white text-xl md:text-2xl tracking-tighter">PRO</span>
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[8px] text-gray-500 font-bold tracking-[0.2em] uppercase">Master Equity</span>
                  <span className="text-white text-xs tracking-[0.4em] mt-1 opacity-80">•••• •••• •••• ••••</span>
                  <span className="text-white text-base md:text-lg font-medium tracking-widest mt-1">5316</span>
                </div>
              </div>

              {/* Stage + Info */}
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <h2 className="text-[22px] md:text-[26px] font-bold text-white tracking-tight">Stage 1</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_6px_#00ffa3]" />
                    <span className="text-[9px] md:text-[10px] font-bold text-[#00FFA3] uppercase tracking-[0.1em]">STATUS: CHALLENGE</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-8">
                  <div>
                    <span className="text-[8px] md:text-[10px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">Start Balance</span>
                    <span className="text-[15px] md:text-[19px] font-medium text-white tracking-tight">100,000.00 USDT</span>
                  </div>
                  <div>
                    <span className="text-[8px] md:text-[10px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">End of Period</span>
                    <span className="text-[15px] md:text-[19px] font-medium text-white tracking-tight">Unlimited</span>
                  </div>
                  <div>
                    <span className="text-[8px] md:text-[10px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">Risk Limit (24 Hours)</span>
                    <span className="text-[15px] md:text-[19px] font-medium text-white tracking-tight">5,000.00 USDT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/trading")}
                  className="flex-1 h-10 md:h-12 flex items-center justify-center rounded-xl bg-[#00FFA3] hover:bg-[#00e693] text-[13px] md:text-[15px] font-bold text-black transition-colors"
                >
                  Trade
                </button>
                <button
                  onClick={() => navigate("/control-panel")}
                  className="flex-1 h-10 md:h-12 flex items-center justify-center rounded-xl border border-white/10 bg-[#131f1c] hover:bg-[#1a2824] text-[13px] md:text-[15px] font-medium text-white transition-colors"
                >
                  Control Panel
                </button>
              </div>
            </div>
          </div>

          <NeedAssistance />
        </div>
      </div>
    </div>

    {/* ═══ DESKTOP LAYOUT (≥ xl) ═══ */}
    <div className="hidden xl:block">
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <NavAccountsSubsection />
          <div className="flex flex-col gap-1.5">
            <header className="font-bold text-gray-400 text-[10px] tracking-[2px] uppercase">Trading Identity</header>
            <h1 className="text-white text-4xl tracking-tight">ID: 200050316</h1>
            <p className="text-gray-400 text-sm">Institutional Prop Account • Multi-Asset Environment</p>
          </div>
          <section className="overflow-x-auto pb-2">
            <div className="min-w-[560px]">
              <MainHedgeModuleSubsection />
            </div>
          </section>
        </div>
      </DashboardLayout>
    </div>
  </>);
};