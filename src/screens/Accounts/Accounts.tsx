import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { NavAccountsSubsection } from "./sections/NavAccountsSubsection";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { ApiError, api, type AppUser, type ActiveChallenge } from "../../lib/api";
import { useAuth } from "../../lib/auth";

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
  <div className="mt-4 min-[375px]:mt-5 md:mt-auto md:pt-6 lg:pt-8 rounded-xl md:rounded-2xl border border-[#163e4a]/40 bg-[#08141c]/60 p-3 min-[375px]:p-4 md:p-6 lg:p-8">
    <p className="mb-2 min-[375px]:mb-3 md:mb-4 lg:mb-5 text-[10px] min-[375px]:text-xs md:text-sm lg:text-base text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-5">
      <button className="h-9 min-[375px]:h-10 md:h-12 lg:h-16 rounded-xl md:rounded-2xl bg-[#00FFA3] text-[10px] min-[375px]:text-xs md:text-sm lg:text-base font-bold text-black transition-colors hover:bg-[#00e693]">Contact Support</button>
      <button className="h-9 min-[375px]:h-10 md:h-12 lg:h-16 rounded-xl md:rounded-2xl border border-[#163e4a] bg-[#0b1820] hover:bg-[#132028] text-[10px] min-[375px]:text-xs md:text-sm lg:text-base font-bold text-white transition-colors">Help</button>
    </div>
  </div>
);

const sameUser = (left: AppUser | null | undefined, right: AppUser | null | undefined) =>
  Boolean(left) &&
  Boolean(right) &&
  left?.id === right?.id &&
  left?.name === right?.name &&
  left?.surname === right?.surname &&
  left?.email === right?.email &&
  left?.account_id === right?.account_id &&
  left?.created_at === right?.created_at;

/* ─── Challenge Card (Mobile) ─── */
const ChallengeCardMobile = ({ challenge, navigate, tradingIdentity }: { challenge: ActiveChallenge; navigate: (path: string) => void; tradingIdentity: string }) => {
  const accountSuffix = tradingIdentity.slice(-4);
  return (
    <div className="relative rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#0a2118_0%,#05110e_100%)] p-3 min-[375px]:p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col">
      <img src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png" alt="" className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="relative z-10 flex flex-col gap-4 md:gap-8 lg:gap-12">

        {/* Top section: PRO Card + Stage */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 lg:gap-10">
          {/* PRO Card */}
          <div className="w-full max-w-[260px] min-[375px]:max-w-[300px] md:max-w-[300px] lg:max-w-[420px] h-[150px] min-[375px]:h-[170px] md:h-[190px] lg:h-[260px] rounded-2xl bg-[linear-gradient(135deg,#13161c_0%,#07080a_100%)] border border-white/10 px-4 pt-4 pb-7 min-[375px]:px-5 min-[375px]:pt-5 min-[375px]:pb-8 md:px-6 md:pt-5 md:pb-10 lg:px-8 lg:pt-7 lg:pb-14 flex flex-col justify-between shadow-2xl overflow-hidden shrink-0">
            <span className="font-black italic text-white text-xl min-[375px]:text-2xl md:text-3xl lg:text-4xl tracking-tighter">{challenge.challenge_name.toUpperCase()}</span>
            <div className="flex flex-col">
              <span className="text-[8px] min-[375px]:text-[9px] md:text-[10px] lg:text-[12px] text-gray-500 font-bold tracking-[0.2em] uppercase">Master Equity</span>
              <span className="text-white text-xs min-[375px]:text-sm md:text-sm lg:text-lg tracking-[0.4em] mt-1 min-[375px]:mt-1.5 md:mt-2 opacity-80">•••• •••• •••• ••••</span>
              <span className="text-white text-base min-[375px]:text-lg md:text-xl lg:text-2xl font-medium tracking-widest mt-1 min-[375px]:mt-1.5 md:mt-2">{accountSuffix}</span>
            </div>
          </div>

          {/* Stage heading */}
          <div className="mt-4 md:mt-0 md:flex-1">
            <h2 className="text-[28px] min-[375px]:text-[32px] md:text-[40px] lg:text-[56px] font-bold text-white tracking-tight">Stage 1</h2>
            <div className="flex items-center gap-1.5 min-[375px]:gap-2 mt-1 md:mt-2 lg:mt-3">
              <div className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00ffa3]" />
              <span className="text-[10px] min-[375px]:text-[11px] md:text-[14px] lg:text-[17px] font-bold text-[#00FFA3] uppercase tracking-[0.1em]">STATUS: CHALLENGE</span>
            </div>
          </div>
        </div>

        {/* Balance items */}
        <div className="flex flex-col gap-2 min-[375px]:gap-3 md:flex-row md:gap-6 lg:gap-10">
          <div>
            <span className="text-[9px] min-[375px]:text-[10px] md:text-[12px] lg:text-[15px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5 md:mb-1">Start Balance</span>
            <span className="text-[17px] min-[375px]:text-[19px] md:text-[24px] lg:text-[32px] font-medium text-white tracking-tight">{challenge.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
          </div>
          <div>
            <span className="text-[9px] min-[375px]:text-[10px] md:text-[12px] lg:text-[15px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5 md:mb-1">End of Period</span>
            <span className="text-[17px] min-[375px]:text-[19px] md:text-[24px] lg:text-[32px] font-medium text-white tracking-tight">Unlimited</span>
          </div>
          <div>
            <span className="text-[9px] min-[375px]:text-[10px] md:text-[12px] lg:text-[15px] font-medium text-gray-400 uppercase tracking-[0.08em] block mb-0.5 md:mb-1">Purchased</span>
            <span className="text-[17px] min-[375px]:text-[19px] md:text-[24px] lg:text-[32px] font-medium text-white tracking-tight">{new Date(challenge.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-5 pt-1">
          <button
            onClick={() => navigate("/trading")}
            className="flex-1 h-11 min-[375px]:h-12 md:h-14 lg:h-16 flex items-center justify-center rounded-xl md:rounded-2xl bg-[#00FFA3] hover:bg-[#00e693] text-[13px] min-[375px]:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-black transition-colors"
          >
            Trade
          </button>
          <button
            onClick={() => navigate("/control-panel")}
            className="flex-1 h-11 min-[375px]:h-12 md:h-14 lg:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border border-white/10 bg-[#131f1c] hover:bg-[#1a2824] text-[13px] min-[375px]:text-[14px] md:text-[16px] lg:text-[18px] font-medium text-white transition-colors"
          >
            Control Panel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ─── */
const NoChallenges = ({ navigate }: { navigate: (path: string) => void }) => (
  <div className="relative rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#0a1a14_0%,#0b0f14_100%)] p-6 min-[375px]:p-8 md:p-10 overflow-hidden flex flex-col items-center justify-center gap-4 min-h-[200px]">
    <div className="text-center">
      <h3 className="text-white text-lg min-[375px]:text-xl md:text-2xl font-bold mb-2">No Active Challenges</h3>
      <p className="text-gray-400 text-xs min-[375px]:text-sm md:text-base mb-4">Purchase a challenge to start trading and see it here.</p>
      <button
        onClick={() => navigate("/challenge")}
        className="inline-flex items-center gap-2 bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-bold text-sm px-6 py-3 rounded-xl transition-colors border-none cursor-pointer"
      >
        Get a Challenge
        <ArrowUpRight size={16} />
      </button>
    </div>
  </div>
);

/* ─── Desktop Challenge Card ─── */
const DesktopChallengeCard = ({ challenge, navigate, tradingIdentity }: { challenge: ActiveChallenge; navigate: (path: string) => void; tradingIdentity: string }) => {
  const accountSuffix = tradingIdentity.slice(-4);
  return (
    <div className="w-full relative rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 flex flex-col xl:flex-row items-center justify-between gap-8 2xl:gap-12 border border-white/5 bg-[linear-gradient(90deg,#0a2118_0%,#05110e_100%)] overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-10 2xl:gap-14 flex-1 w-full">
        {/* Card */}
        <div className="relative w-full max-w-[260px] 2xl:max-w-[340px] h-[150px] 2xl:h-[200px] rounded-2xl bg-[linear-gradient(135deg,#13161c_0%,#07080a_100%)] border border-white/10 p-5 2xl:p-7 flex flex-col justify-between shrink-0 shadow-2xl overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 2xl:w-40 2xl:h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />
          <div className="relative z-10">
            <span className="font-inter font-black italic text-white text-2xl 2xl:text-3xl tracking-tighter">{challenge.challenge_name.toUpperCase()}</span>
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="font-inter font-bold text-[8px] 2xl:text-[10px] text-gray-500 tracking-[0.2em] uppercase">Master Equity</span>
            <div className="flex items-center mt-2 opacity-80">
              <span className="text-white text-sm 2xl:text-base tracking-[0.4em] leading-none">•••• •••• •••• ••••</span>
            </div>
            <span className="font-inter font-medium text-white text-lg 2xl:text-xl tracking-widest mt-1 leading-none">{accountSuffix}</span>
          </div>
        </div>

        {/* Info columns */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-8 sm:gap-12 2xl:gap-16 w-full">
          <div className="flex flex-col gap-4 2xl:gap-6 flex-1">
            <div>
              <h2 className="font-inter font-bold text-white text-[26px] 2xl:text-[34px] tracking-tight mb-2 2xl:mb-3">Stage 1</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                <span className="font-inter font-bold text-[#00ffa3] text-[10px] 2xl:text-[13px] tracking-[0.1em] uppercase">STATUS: CHALLENGE</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">START BALANCE</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">{challenge.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 2xl:gap-7 flex-1 sm:border-l sm:border-white/10 sm:pl-10 2xl:pl-14">
            <div>
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">END OF PERIOD</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">Unlimited</span>
            </div>
            <div>
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">PURCHASED</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">{new Date(challenge.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row xl:flex-col w-full xl:w-[200px] 2xl:w-[260px] shrink-0 gap-3 2xl:gap-4">
        <button
          onClick={() => navigate("/trading")}
          className="w-full flex justify-center items-center py-3.5 2xl:py-[18px] px-6 2xl:px-8 bg-[#00ffa3] hover:bg-[#00e693] rounded-xl 2xl:rounded-2xl transition-colors shadow-[0_4px_24px_rgba(0,255,163,0.15)]"
        >
          <span className="font-inter font-bold text-[#0b0f14] text-[15px] 2xl:text-[17px] tracking-wide">Trade</span>
        </button>
        <button
          onClick={() => navigate("/control-panel")}
          className="w-full flex justify-center items-center py-3.5 2xl:py-[18px] px-6 2xl:px-8 bg-[#131f1c] hover:bg-[#1a2824] border border-[#ffffff0a] rounded-xl 2xl:rounded-2xl transition-colors"
        >
          <span className="font-inter font-medium text-white text-[15px] 2xl:text-[17px] tracking-wide">Control Panel</span>
        </button>
      </div>
    </div>
  );
};

export const Accounts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("challenge");
  const [liveUser, setLiveUser] = useState<AppUser | null>(null);
  const [challenges, setChallenges] = useState<ActiveChallenge[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const tradingIdentity = liveUser?.account_id || user?.account_id || "000000000000";

  useEffect(() => {
    if (!user) {
      return;
    }

    api.accounts(user.id)
      .then((response) => {
        if (response.user) {
          setLiveUser((current) => (sameUser(current, response.user) ? current : response.user));
          if (!sameUser(user, response.user)) {
            setUser(response.user);
          }
        }
        if (response.challenges) {
          setChallenges(response.challenges);
        }
      })
      .catch((error) => {
        console.error("[accounts] failed to refresh user", error instanceof ApiError ? error.message : error);
      });
  }, [setUser, user?.id]);

  const isMobileTabActive = (route: string) =>
    location.pathname.startsWith(route);

  return (<>
    {/* ═══ MOBILE LAYOUT (< xl) ═══ */}
    <div className="xl:hidden w-full overflow-x-clip flex flex-col min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 md:h-16 lg:h-20 items-center justify-between bg-[#05070A]/95 px-3 backdrop-blur-md min-[375px]:px-4 md:px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-6 w-auto object-contain min-[375px]:h-7 md:h-9 lg:h-12" />
        </Link>
        <div className="flex items-center gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-6">
          <button className="flex items-center gap-1 text-[11px] text-gray-400 min-[375px]:text-xs md:text-sm lg:text-base md:gap-1.5 lg:gap-2">
            EN <ChevronDown className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </button>
          <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px] md:px-5 md:py-2 md:text-sm lg:px-8 lg:py-3 lg:text-lg md:rounded-xl">
            START
          </Link>
          <button onClick={() => setSidebarOpen((p) => !p)} className="text-gray-300 hover:text-white md:p-1 lg:p-2" aria-label="Toggle menu">
            {sidebarOpen ? <X className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" /> : <Menu className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" />}
          </button>
        </div>
      </header>

      {/* Main nav tabs (hamburger-toggled) */}
      {sidebarOpen && <nav className="flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full">
        <div className="flex w-full justify-evenly rounded-[13px] border border-[#12313a] bg-[#081018]/80 p-1 min-[375px]:rounded-[16px] min-[375px]:p-1.5 min-[400px]:rounded-[18px] md:gap-2 md:rounded-[22px] md:px-3 md:py-2 lg:gap-4 lg:rounded-[28px] lg:px-5 lg:py-3">
          {mobileNavTabs.map((tab) => {
            const isActive = isMobileTabActive(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                onClick={() => setSidebarOpen(false)}
                className={`flex-1 relative flex items-center justify-center text-center rounded-lg px-0.5 py-1.5 text-[8px] leading-tight font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-1 min-[375px]:py-2 min-[375px]:text-[10px] min-[400px]:px-2 min-[400px]:text-[11px] md:rounded-2xl md:px-6 md:py-3 md:text-sm lg:px-10 lg:py-5 lg:text-lg ${
                  isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 md:bottom-2 md:left-3 md:right-3 md:h-0.5 lg:bottom-3 lg:left-5 lg:right-5 ${isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
        </div>
      </nav>}

      {/* Account sub-tabs */}
      <div className="flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full">
        <div className="flex w-full justify-evenly rounded-[13px] border border-[#12313a] bg-[#081018]/80 p-1 min-[375px]:rounded-[16px] min-[375px]:p-1.5 min-[400px]:rounded-[18px] md:gap-2 md:rounded-[22px] md:px-3 md:py-2 lg:gap-4 lg:rounded-[28px] lg:px-5 lg:py-3">
          {accountTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 relative flex items-center justify-center text-center rounded-lg px-0.5 py-1.5 text-[8px] leading-tight font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-1 min-[375px]:py-2 min-[375px]:text-[10px] min-[400px]:px-2 min-[400px]:text-[11px] md:rounded-2xl md:px-6 md:py-3 md:text-sm lg:px-10 lg:py-5 lg:text-lg ${
                activeTab === tab.value ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 md:bottom-2 md:left-3 md:right-3 md:h-0.5 lg:bottom-3 lg:left-5 lg:right-5 ${activeTab === tab.value ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col relative w-full overflow-x-clip">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-6 md:py-6 lg:px-10 lg:py-8 flex-1 flex flex-col gap-3 md:gap-5 lg:gap-6">

          {/* Trading Identity */}
          <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2 pb-3 min-[375px]:pb-4 md:pb-5 lg:pb-6 border-b border-white/5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 min-[375px]:text-[10px] md:text-[11px] lg:text-[13px]">Trading Identity</span>
            <h1 className="text-[22px] font-bold text-white tracking-tight min-[375px]:text-[26px] md:text-[32px] lg:text-[40px]">ID: {tradingIdentity}</h1>
            <p className="text-[10px] text-gray-400 min-[375px]:text-[11px] md:text-sm lg:text-base">Institutional Prop Account • Multi-Asset Environment</p>
          </div>

          {/* Challenge Cards */}
          {challenges.length > 0 ? (
            <div className="flex flex-col gap-4">
              {challenges.map((ch) => (
                <ChallengeCardMobile key={ch.id} challenge={ch} navigate={navigate} tradingIdentity={tradingIdentity} />
              ))}
            </div>
          ) : (
            <NoChallenges navigate={navigate} />
          )}

          <NeedAssistance />
        </div>
      </div>
    </div>

    {/* ═══ DESKTOP LAYOUT (≥ xl) ═══ */}
    <div className="hidden xl:block">
      <DashboardLayout>
        <div className="flex flex-col gap-6 2xl:gap-10">
          <NavAccountsSubsection />
          <div className="flex flex-col gap-1.5 2xl:gap-2.5">
            <header className="font-bold text-gray-400 text-[10px] 2xl:text-[13px] tracking-[2px] uppercase">Trading Identity</header>
            <h1 className="text-white text-4xl 2xl:text-5xl tracking-tight">ID: {tradingIdentity}</h1>
            <p className="text-gray-400 text-sm 2xl:text-base">Institutional Prop Account • Multi-Asset Environment</p>
          </div>
          <section className="pb-2 flex flex-col gap-6">
            {challenges.length > 0 ? (
              challenges.map((ch) => (
                <DesktopChallengeCard key={ch.id} challenge={ch} navigate={navigate} tradingIdentity={tradingIdentity} />
              ))
            ) : (
              <NoChallenges navigate={navigate} />
            )}
          </section>
        </div>
      </DashboardLayout>
    </div>
  </>);
};
