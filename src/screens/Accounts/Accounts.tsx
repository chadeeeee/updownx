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
  <div className="mt-3 min-[375px]:mt-4 md:mt-5 lg:mt-6 rounded-xl border border-[#163e4a]/40 bg-[#08141c]/60 p-3 min-[375px]:p-4 md:p-6 lg:p-8">
    <p className="mb-2 min-[375px]:mb-3 md:mb-4 lg:mb-5 text-[10px] min-[375px]:text-xs md:text-sm lg:text-base text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-5">
      <button className="h-9 min-[375px]:h-10 md:h-14 lg:h-16 rounded-xl bg-[#00FFA3] text-[10px] min-[375px]:text-xs md:text-sm lg:text-base font-bold text-black">Contact Support</button>
      <button className="h-9 min-[375px]:h-10 md:h-14 lg:h-16 rounded-xl border border-[#163e4a] bg-[#0b1820] text-[10px] min-[375px]:text-xs md:text-sm lg:text-base font-bold text-white">Help</button>
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

      {/* Main nav tabs (hamburger-toggled, pill style) */}
      {sidebarOpen && <nav className="flex justify-center overflow-x-auto scrollbar-hide border-b border-[#1a2a32]/60 bg-[#05070A] px-2 py-2 min-[375px]:px-3 min-[375px]:py-3 md:px-6 md:py-4">
        <div className="flex w-full justify-evenly gap-0.5 rounded-[13px] border border-[#12313a] bg-[#081018]/80 px-1 py-1 min-[375px]:gap-0.5 min-[375px]:rounded-[16px] min-[375px]:px-1.5 min-[375px]:py-1.5 min-[400px]:gap-1 min-[400px]:rounded-[18px] min-[400px]:px-2 md:gap-2 md:rounded-[22px] md:px-3 md:py-2">
          {mobileNavTabs.map((tab) => {
            const isActive = isMobileTabActive(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                onClick={() => setSidebarOpen(false)}
                className={`relative whitespace-nowrap rounded-lg px-2 py-1.5 text-[9px] font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-2.5 min-[375px]:py-2 min-[375px]:text-[11px] min-[400px]:px-3 min-[400px]:text-[12px] md:rounded-2xl md:px-5 md:py-3 md:text-sm lg:px-6 lg:text-base ${
                  isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 ${isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
        </div>
      </nav>}

      {/* Account sub-tabs — pill style matching main nav */}
      <div className="flex justify-center overflow-x-auto scrollbar-hide border-b border-[#1a2a32]/60 bg-[#05070A] px-2 py-2 min-[375px]:px-3 min-[375px]:py-3 md:px-6 md:py-4">
        <div className="flex w-full justify-evenly gap-0.5 rounded-[13px] border border-[#12313a] bg-[#081018]/80 px-1 py-1 min-[375px]:gap-0.5 min-[375px]:rounded-[16px] min-[375px]:px-1.5 min-[375px]:py-1.5 min-[400px]:gap-1 min-[400px]:rounded-[18px] min-[400px]:px-2 md:gap-2 md:rounded-[22px] md:px-3 md:py-2">
          {accountTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative whitespace-nowrap rounded-lg px-2 py-1.5 text-[9px] font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-2.5 min-[375px]:py-2 min-[375px]:text-[11px] min-[400px]:px-3 min-[400px]:text-[12px] md:rounded-2xl md:px-5 md:py-3 md:text-sm lg:px-6 lg:text-base ${
                activeTab === tab.value ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 ${activeTab === tab.value ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col relative">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-6 lg:px-12 flex-1 flex flex-col gap-3 md:gap-4">

          {/* Trading Identity */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 min-[375px]:text-[10px]">Trading Identity</span>
            <h1 className="text-[22px] font-bold text-white tracking-tight min-[375px]:text-[24px] md:text-3xl">ID: 200050316</h1>
            <p className="text-[10px] text-gray-400 min-[375px]:text-[11px] md:text-sm">Institutional Prop Account • Multi-Asset Environment</p>
          </div>

          {/* Account Card */}
          <div className="relative rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#0a2118_0%,#05110e_100%)] p-4 min-[375px]:p-5 md:p-8 overflow-hidden md:flex-1 flex flex-col">
            <img src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png" alt="" className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 flex flex-col gap-4 md:gap-5 md:flex-1">

              {/* PRO Card */}
              <div className="w-full max-w-[300px] min-[375px]:max-w-[320px] md:max-w-[420px] lg:max-w-[500px] h-[170px] min-[375px]:h-[185px] md:h-[240px] lg:h-[290px] rounded-2xl bg-[linear-gradient(135deg,#13161c_0%,#07080a_100%)] border border-white/10 px-5 pt-5 pb-9 min-[375px]:px-6 md:px-8 md:pt-7 md:pb-14 lg:px-10 lg:pt-8 lg:pb-16 flex flex-col justify-between shadow-2xl overflow-hidden">
                <span className="font-black italic text-white text-2xl min-[375px]:text-3xl md:text-4xl lg:text-5xl tracking-tighter">PRO</span>
                <div className="flex flex-col">
                  <span className="text-[9px] min-[375px]:text-[10px] md:text-[12px] lg:text-[14px] text-gray-500 font-bold tracking-[0.2em] uppercase">Master Equity</span>
                  <span className="text-white text-sm min-[375px]:text-base md:text-lg lg:text-xl tracking-[0.4em] mt-1.5 opacity-80">•••• •••• •••• ••••</span>
                  <span className="text-white text-lg min-[375px]:text-xl md:text-2xl lg:text-3xl font-medium tracking-widest mt-1.5">5316</span>
                </div>
              </div>

              {/* Stage + Info */}
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <h2 className="text-[32px] min-[375px]:text-[36px] md:text-[44px] lg:text-[56px] font-bold text-white tracking-tight">Stage 1</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_6px_#00ffa3]" />
                    <span className="text-[11px] min-[375px]:text-[12px] md:text-[14px] lg:text-[16px] font-bold text-[#00FFA3] uppercase tracking-[0.1em]">STATUS: CHALLENGE</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-8">
                  <div>
                    <span className="text-[11px] min-[375px]:text-[12px] md:text-[14px] lg:text-[16px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">Start Balance</span>
                    <span className="text-[20px] min-[375px]:text-[22px] md:text-[28px] lg:text-[34px] font-medium text-white tracking-tight">100,000.00 USDT</span>
                  </div>
                  <div>
                    <span className="text-[11px] min-[375px]:text-[12px] md:text-[14px] lg:text-[16px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">End of Period</span>
                    <span className="text-[20px] min-[375px]:text-[22px] md:text-[28px] lg:text-[34px] font-medium text-white tracking-tight">Unlimited</span>
                  </div>
                  <div>
                    <span className="text-[11px] min-[375px]:text-[12px] md:text-[14px] lg:text-[16px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5">Risk Limit (24 Hours)</span>
                    <span className="text-[20px] min-[375px]:text-[22px] md:text-[28px] lg:text-[34px] font-medium text-white tracking-tight">5,000.00 USDT</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 md:mt-auto">
                <button
                  onClick={() => navigate("/trading")}
                  className="flex-1 h-14 md:h-16 lg:h-20 flex items-center justify-center rounded-xl bg-[#00FFA3] hover:bg-[#00e693] text-[15px] md:text-[17px] lg:text-[19px] font-bold text-black transition-colors"
                >
                  Trade
                </button>
                <button
                  onClick={() => navigate("/control-panel")}
                  className="flex-1 h-14 md:h-16 lg:h-20 flex items-center justify-center rounded-xl border border-white/10 bg-[#131f1c] hover:bg-[#1a2824] text-[15px] md:text-[17px] lg:text-[19px] font-medium text-white transition-colors"
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