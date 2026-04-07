import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "../../components/Sidebar";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

// Candlestick data for the chart
const candleData = [
  { open: 45, close: 55, high: 60, low: 40, color: "green" },
  { open: 55, close: 48, high: 58, low: 44, color: "red" },
  { open: 48, close: 52, high: 56, low: 42, color: "green" },
  { open: 52, close: 58, high: 62, low: 50, color: "green" },
  { open: 58, close: 50, high: 60, low: 46, color: "red" },
  { open: 50, close: 45, high: 54, low: 40, color: "red" },
  { open: 45, close: 55, high: 58, low: 42, color: "green" },
  { open: 55, close: 60, high: 65, low: 52, color: "green" },
  { open: 60, close: 54, high: 63, low: 50, color: "red" },
  { open: 54, close: 62, high: 66, low: 52, color: "green" },
  { open: 62, close: 56, high: 64, low: 52, color: "red" },
  { open: 56, close: 52, high: 58, low: 48, color: "red" },
  { open: 52, close: 58, high: 62, low: 48, color: "green" },
  { open: 58, close: 63, high: 68, low: 56, color: "green" },
  { open: 63, close: 55, high: 65, low: 50, color: "red" },
  { open: 55, close: 60, high: 64, low: 52, color: "green" },
  { open: 60, close: 65, high: 70, low: 58, color: "green" },
  { open: 65, close: 58, high: 67, low: 54, color: "red" },
  { open: 58, close: 62, high: 66, low: 55, color: "green" },
  { open: 62, close: 60, high: 66, low: 56, color: "red" },
];

const dateLabels = ["MAY 24", "MAY 26", "MAY 28", "MAY 30", "JUN 01"];

const CandlestickChart = () => {
  return (
    <svg width="100%" height="100%" className="w-full h-full block">
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          y1={`${10 + (i * 80) / 3}%`}
          x2="100%"
          y2={`${10 + (i * 80) / 3}%`}
          stroke="#1a2030"
          strokeWidth={0.5}
        />
      ))}

      {candleData.map((candle, i) => {
        const xPercent = (i * 100) / candleData.length + 0.8;
        const widthPercent = (100 / candleData.length) - 1.6;
        const wickXPercent = xPercent + widthPercent / 2;

        const maxPrice = 75;
        const minPrice = 35;
        const scale = 80 / (maxPrice - minPrice);

        const bodyTop = Math.min(candle.open, candle.close);
        const bodyBottom = Math.max(candle.open, candle.close);
        const bodyY = 10 + (maxPrice - bodyBottom) * scale;
        const bodyH = Math.max((bodyBottom - bodyTop) * scale, 0.5);

        const wickY1 = 10 + (maxPrice - candle.high) * scale;
        const wickY2 = 10 + (maxPrice - candle.low) * scale;

        const fill = candle.color === "green" ? "#00ffa3" : "#ff4d4d";
        const stroke = candle.color === "green" ? "#00ffa3" : "#ff4d4d";

        return (
          <g key={i}>
            <line x1={`${wickXPercent}%`} y1={`${wickY1}%`} x2={`${wickXPercent}%`} y2={`${wickY2}%`} stroke={stroke} strokeWidth={1.5} />
            <rect x={`${xPercent}%`} y={`${bodyY}%`} width={`${widthPercent}%`} height={`${bodyH}%`} fill={fill} rx={2} />
          </g>
        );
      })}

      {/* Date labels */}
      {dateLabels.map((label, i) => {
        const xPos = 5 + (i * 90) / (dateLabels.length - 1);
        return (
          <text
            key={i}
            x={`${xPos}%`}
            y="98%"
            fill="#4a5568"
            fontSize="10"
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// Criteria table data
const criteriaRows = [
  {
    label: "Account Type",
    stage1: { text: "Standard Pro", highlight: true },
    stage2: { text: "Institutional" },
    stage3: { text: "Hedge Master" },
  },
  {
    label: "Starting Balance",
    stage1: { text: "100,000 USDT", highlight: true },
    stage2: { text: "250,000 USDT" },
    stage3: { text: "1,000,000 USDT" },
  },
  {
    label: "Leverage",
    stage1: { text: "1:100", highlight: true },
    stage2: { text: "1:100" },
    stage3: { text: "1:200" },
  },
  {
    label: "Min Trading Days",
    stage1: { text: "4 / 5 Days", highlight: true, progress: 90, progressLabel: "90%" },
    stage2: { text: "10 Days" },
    stage3: { text: "Unlimited" },
  },
  {
    label: "Max Daily Loss",
    stage1: { text: "0 / 5,000", highlight: true, progress: 3, progressLabel: "Safe", safe: true },
    stage2: { text: "12,500" },
    stage3: { text: "50,000" },
  },
  {
    label: "Target Profit",
    stage1: { text: "1,922.62 / 8,000", highlight: true, progress: 24, progressLabel: "24%" },
    stage2: { text: "20,000" },
    stage3: { text: "Withdrawal" },
  },
];

const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];

const NeedAssistance = () => (
  <div className="mt-5 rounded-xl md:rounded-2xl border border-[#163e4a]/40 bg-[#08141c]/60 p-3 min-[375px]:p-4 md:p-6">
    <p className="mb-2 min-[375px]:mb-3 md:mb-4 text-[10px] min-[375px]:text-xs md:text-sm text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-2 min-[375px]:gap-3 md:gap-4">
      <button className="h-9 min-[375px]:h-10 md:h-14 rounded-xl md:rounded-2xl bg-[#00FFA3] text-[10px] min-[375px]:text-xs md:text-base font-bold text-black transition-colors hover:bg-[#00e693]">Contact Support</button>
      <button className="h-9 min-[375px]:h-10 md:h-14 rounded-xl md:rounded-2xl border border-[#163e4a] bg-[#0b1820] hover:bg-[#132028] text-[10px] min-[375px]:text-xs md:text-base font-bold text-white transition-colors">Help</button>
    </div>
  </div>
);

export const Trading = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"7D" | "1M" | "ALL">("7D");
  const location = useLocation();

  const isMobileTabActive = (route: string) => {
    if (route === "/accounts") return true; // Control Panel is accessed from Accounts
    return location.pathname.startsWith(route);
  };

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

      {/* Page Content */}
      <div className="flex-1 flex flex-col relative w-full overflow-x-clip">
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
        <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-6 flex flex-col gap-4 min-[375px]:gap-5 md:gap-6">

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-xl min-[375px]:rounded-2xl bg-gradient-to-br from-[#0a1a14] to-[#0b0f14] border border-[#00ffa3]/10 p-4 min-[375px]:p-5 md:p-8">
            <div className="absolute inset-0 bg-[url('https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#05070a]/80 rounded-full px-2.5 py-1 mb-3 md:mb-4 border border-[#00ffa3]/20 md:px-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                <span className="text-[#00ffa3] text-[10px] min-[375px]:text-xs md:text-sm font-semibold">$101,922.82</span>
              </div>
              <h1 className="font-bold text-white text-lg min-[375px]:text-xl md:text-3xl tracking-tight mb-1.5 md:mb-2">
                Pro Trading Terminal
              </h1>
              <p className="text-gray-400 text-[11px] min-[375px]:text-xs md:text-base leading-relaxed mb-4 md:mb-5">
                Your institutional-grade control panel is ready. Access deep liquidity and real-time execution.
              </p>
              <a
                href="https://trade.updownx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-semibold text-[11px] min-[375px]:text-xs md:text-base px-4 py-2 min-[375px]:px-5 min-[375px]:py-2.5 md:px-6 md:py-3 rounded-xl transition-colors no-underline"
              >
                Go to Trading
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Stage 1 + Chart */}
          <div className="flex flex-col gap-3 min-[375px]:gap-4 md:gap-5">
            {/* Stage Header */}
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-white text-base min-[375px]:text-lg md:text-2xl">Stage 1</h2>
              <div className="flex items-center gap-1 md:gap-1.5">
                {(["7D", "1M", "ALL"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 min-[375px]:px-2.5 py-1 rounded-md text-[9px] min-[375px]:text-[10px] md:px-3.5 md:py-1.5 md:rounded-lg md:text-xs font-semibold transition-colors border-none cursor-pointer ${
                      timeRange === range
                        ? "bg-[#00ffa3] text-[#05070a]"
                        : "bg-[#111820] text-gray-400 hover:bg-[#1a2232]"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Account stats */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 md:gap-x-8">
              <div>
                <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase block">ACCOUNT ASSETS</span>
                <span className="font-bold text-white text-lg min-[375px]:text-xl md:text-2xl tracking-tight">101,922.62</span>
                <span className="font-medium text-[#00ffa3] text-[10px] min-[375px]:text-xs md:text-sm ml-1">USDT</span>
              </div>
              <div>
                <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase block">DAILY CHANGE</span>
                <span className="font-semibold text-[#00ffa3] text-sm min-[375px]:text-base md:text-lg">+0.00 (0.00%)</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00ffa3]" />
                <span className="text-[8px] min-[375px]:text-[9px] md:text-[11px] text-[#00ffa3] font-semibold tracking-wider uppercase">Target Profit</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ff4d4d]" />
                <span className="text-[8px] min-[375px]:text-[9px] md:text-[11px] text-[#ff4d4d] font-semibold tracking-wider uppercase">Max Loss</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 relative h-[180px] min-[375px]:h-[220px] md:h-[320px]">
              <div className="absolute inset-3 min-[375px]:inset-4 md:inset-5">
                <CandlestickChart />
              </div>
            </div>
          </div>

          {/* Gradation Challenge Card */}
          <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 p-3 min-[375px]:p-4 md:p-6 flex flex-col gap-3 md:gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-[8px] min-[375px]:text-[9px] md:text-[11px] text-gray-400 tracking-[1.5px] uppercase">Gradation Challenge</span>
              <span className="bg-[#00ffa3]/15 text-[#00ffa3] text-[8px] min-[375px]:text-[9px] md:text-[11px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-md tracking-wider uppercase">Active</span>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-2 min-[375px]:gap-2.5 md:gap-4">
              <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">Unrealized Profit</span>
                <span className="font-semibold text-white text-sm min-[375px]:text-base md:text-xl">--</span>
              </div>
              <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">Assets</span>
                <span className="font-bold text-white text-sm min-[375px]:text-base md:text-xl">101,922.62</span>
              </div>
              <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">Realized Profit</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[#00ffa3] text-sm min-[375px]:text-base md:text-xl">+1,922.62</span>
                  <ArrowUpRight size={12} className="text-[#00ffa3]" />
                </div>
              </div>
              <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">Balance</span>
                <span className="font-bold text-white text-sm min-[375px]:text-base md:text-xl">101,922.62</span>
              </div>
            </div>

            {/* Equity Health */}
            <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] min-[375px]:text-[10px] md:text-xs text-gray-400">Equity Health</span>
                <span className="font-bold text-[#00ffa3] text-[10px] min-[375px]:text-[11px] md:text-sm">100.0%</span>
              </div>
              <div className="w-full h-1.5 md:h-2 bg-[#1a2030] rounded-full overflow-hidden">
                <div className="h-full bg-[#00ffa3] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          {/* Criteria Table (horizontally scrollable) */}
          <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 overflow-hidden">
            <div>
              <div className="w-full">
                {/* Table header */}
                <div className="grid grid-cols-4 border-b border-white/5">
                  <div className="p-2.5 min-[375px]:p-3 md:p-4">
                    <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">Criteria</span>
                  </div>
                  <div className="p-2.5 min-[375px]:p-3 md:p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                    <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#00ffa3] tracking-[1.5px] uppercase">Stage 1</span>
                  </div>
                  <div className="p-2.5 min-[375px]:p-3 md:p-4">
                    <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">Stage 2</span>
                  </div>
                  <div className="p-2.5 min-[375px]:p-3 md:p-4">
                    <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">Stage 3</span>
                  </div>
                </div>
                {/* Table rows */}
                {criteriaRows.map((row, idx) => (
                  <div key={idx} className={`grid grid-cols-4 ${idx < criteriaRows.length - 1 ? "border-b border-white/5" : ""}`}>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4 flex items-center">
                      <span className="text-[10px] min-[375px]:text-[11px] md:text-sm text-gray-300">{row.label}</span>
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                      <span className="font-semibold text-[10px] min-[375px]:text-[11px] md:text-sm text-white">{row.stage1.text}</span>
                      {row.stage1.progress !== undefined && (
                        <div className="mt-1.5 md:mt-2 flex items-center gap-1.5">
                          <div className="flex-1 h-1 md:h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#00ffa3]" style={{ width: `${row.stage1.progress}%` }} />
                          </div>
                          <span className="text-[8px] md:text-[10px] font-semibold text-[#00ffa3]">{row.stage1.progressLabel}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4 flex items-center">
                      <span className="text-[10px] min-[375px]:text-[11px] md:text-sm text-gray-400">{row.stage2.text}</span>
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4 flex items-center">
                      <span className="text-[10px] min-[375px]:text-[11px] md:text-sm text-gray-400">{row.stage3.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NeedAssistance />
        </div>
      </div>
    </div>

    {/* ═══ DESKTOP LAYOUT (≥ xl) ═══ */}
    <div className="hidden xl:flex relative flex-col min-h-screen bg-[#05070a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          className="absolute top-[62px] left-0 w-full h-full object-cover opacity-60"
          alt="Background"
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png"
        />
      </div>

      {/* Top navigation bar */}
      <div className="sticky top-0 z-50 w-full">
        <TopBar
          onMenuToggle={() => setSidebarOpen(true)}
          logoSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo.png"
          avatarSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/avatar.png"
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 relative z-10">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col gap-6 p-6 sm:p-10 min-w-0 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

          {/* ═══ Hero Banner ═══ */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1a14] to-[#0b0f14] border border-[#00ffa3]/10 p-6 sm:p-8">
            <div className="absolute inset-0 bg-[url('https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#05070a]/80 rounded-full px-3 py-1 mb-4 border border-[#00ffa3]/20">
                <div className="w-2 h-2 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                <span className="text-[#00ffa3] text-xs font-semibold font-inter">$101,922.82</span>
              </div>
              <h1 className="font-inter font-bold text-white text-2xl sm:text-3xl tracking-tight mb-2">
                Pro Trading Terminal
              </h1>
              <p className="font-inter text-gray-400 text-sm leading-relaxed max-w-md mb-5">
                Your institutional-grade control panel is ready. Access<br />
                deep liquidity and real-time execution.
              </p>
              <a
                href="https://trade.updownx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-inter font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors no-underline"
              >
                Go to Trading
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* ═══ Main Dashboard Grid ═══ */}
          <div className="flex flex-col lg:flex-row gap-5">

            {/* Left: Chart Section */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Stage Header */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-inter font-bold text-white text-xl mb-1">Stage 1</h2>
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                    <div>
                      <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase block">ACCOUNT ASSETS</span>
                      <span className="font-inter font-bold text-white text-2xl tracking-tight">101,922.62</span>
                      <span className="font-inter font-medium text-[#00ffa3] text-sm ml-2">USDT</span>
                    </div>
                    <div>
                      <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase block">DAILY CHANGE</span>
                      <span className="font-inter font-semibold text-[#00ffa3] text-lg">+0.00 (0.00%)</span>
                    </div>
                  </div>
                </div>

                {/* Time range pills */}
                <div className="flex items-center gap-1">
                  {(["7D", "1M", "ALL"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-inter font-semibold transition-colors border-none cursor-pointer ${
                        timeRange === range
                          ? "bg-[#00ffa3] text-[#05070a]"
                          : "bg-[#111820] text-gray-400 hover:bg-[#1a2232]"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00ffa3]" />
                  <span className="font-inter text-[10px] text-[#00ffa3] font-semibold tracking-wider uppercase">Target Profit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff4d4d]" />
                  <span className="font-inter text-[10px] text-[#ff4d4d] font-semibold tracking-wider uppercase">Max Loss</span>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-[#0b0f14] rounded-2xl border border-white/5 flex-1 relative min-h-[300px]">
                <div className="absolute inset-5">
                  <CandlestickChart />
                </div>
              </div>
            </div>

            {/* Right: Gradation Challenge Card */}
            <div className="w-full lg:w-[220px] shrink-0">
              <div className="bg-[#0b0f14] rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-inter font-bold text-[9px] text-gray-400 tracking-[1.5px] uppercase">Gradation Challenge</span>
                  <span className="bg-[#00ffa3]/15 text-[#00ffa3] text-[9px] font-bold font-inter px-2 py-0.5 rounded-md tracking-wider uppercase">Active</span>
                </div>

                {/* Unrealized Profit */}
                <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                  <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">Unrealized Profit</span>
                  <span className="font-inter font-semibold text-white text-lg">--</span>
                </div>

                {/* Realized Profit */}
                <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                  <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">Realized Profit</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter font-semibold text-[#00ffa3] text-lg">+1,922.62</span>
                    <ArrowUpRight size={14} className="text-[#00ffa3]" />
                  </div>
                </div>

                {/* Assets */}
                <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                  <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">Assets</span>
                  <span className="font-inter font-bold text-white text-base">101,922.62</span>
                </div>

                {/* Balance */}
                <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                  <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">Balance</span>
                  <span className="font-inter font-bold text-white text-base">101,922.62</span>
                </div>

                {/* Equity Health */}
                <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-inter text-[10px] text-gray-400">Equity Health</span>
                    <span className="font-inter font-bold text-[#00ffa3] text-[11px]">100.0%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ffa3] rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Criteria Table ═══ */}
          <div className="bg-[#0b0f14] rounded-2xl border border-white/5 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-white/5">
              <div className="p-4">
                <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">Criteria</span>
              </div>
              <div className="p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                <span className="font-inter font-bold text-[9px] text-[#00ffa3] tracking-[1.5px] uppercase">Stage 1</span>
              </div>
              <div className="p-4">
                <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">Stage 2</span>
              </div>
              <div className="p-4">
                <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">Stage 3</span>
              </div>
            </div>

            {/* Table rows */}
            {criteriaRows.map((row, idx) => (
              <div key={idx} className={`grid grid-cols-4 ${idx < criteriaRows.length - 1 ? "border-b border-white/5" : ""}`}>
                <div className="p-4 flex items-center">
                  <span className="font-inter text-sm text-gray-300">{row.label}</span>
                </div>
                <div className="p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                  <span className="font-inter font-semibold text-sm text-white">{row.stage1.text}</span>
                  {row.stage1.progress !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.stage1.safe ? "bg-[#00ffa3]" : "bg-[#00ffa3]"}`}
                          style={{ width: `${row.stage1.progress}%` }}
                        />
                      </div>
                      <span className={`font-inter text-[10px] font-semibold ${row.stage1.safe ? "text-[#00ffa3]" : "text-[#00ffa3]"}`}>
                        {row.stage1.progressLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center">
                  <span className="font-inter text-sm text-gray-400">{row.stage2.text}</span>
                </div>
                <div className="p-4 flex items-center">
                  <span className="font-inter text-sm text-gray-400">{row.stage3.text}</span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  </>);
};
