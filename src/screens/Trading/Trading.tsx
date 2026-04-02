import { useState } from "react";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "../../components/Sidebar";
import { ArrowUpRight } from "lucide-react";

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
  const chartWidth = 460;
  const chartHeight = 140;
  const candleWidth = 14;
  const candleGap = 9;
  const padding = 10;

  return (
    <svg width={chartWidth} height={chartHeight} className="w-full max-w-[460px]">
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={0}
          y1={padding + (i * (chartHeight - 2 * padding)) / 3}
          x2={chartWidth}
          y2={padding + (i * (chartHeight - 2 * padding)) / 3}
          stroke="#1a2030"
          strokeWidth={0.5}
        />
      ))}

      {candleData.map((candle, i) => {
        const x = i * (candleWidth + candleGap) + candleGap;
        const maxPrice = 75;
        const minPrice = 35;
        const scale = (chartHeight - 2 * padding) / (maxPrice - minPrice);

        const bodyTop = Math.min(candle.open, candle.close);
        const bodyBottom = Math.max(candle.open, candle.close);
        const bodyY = padding + (maxPrice - bodyBottom) * scale;
        const bodyH = (bodyBottom - bodyTop) * scale || 2;

        const wickY1 = padding + (maxPrice - candle.high) * scale;
        const wickY2 = padding + (maxPrice - candle.low) * scale;
        const wickX = x + candleWidth / 2;

        const fill = candle.color === "green" ? "#00ffa3" : "#ff4d4d";
        const stroke = candle.color === "green" ? "#00ffa3" : "#ff4d4d";

        return (
          <g key={i}>
            <line x1={wickX} y1={wickY1} x2={wickX} y2={wickY2} stroke={stroke} strokeWidth={1.5} />
            <rect x={x} y={bodyY} width={candleWidth} height={bodyH} fill={fill} rx={1} />
          </g>
        );
      })}

      {/* Date labels */}
      {dateLabels.map((label, i) => (
        <text
          key={i}
          x={padding + i * ((chartWidth - 2 * padding) / (dateLabels.length - 1))}
          y={chartHeight - 2}
          fill="#4a5568"
          fontSize="8"
          fontFamily="Inter, sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
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

export const Trading = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"7D" | "1M" | "ALL">("7D");

  return (
    <div className="relative flex flex-col min-h-screen bg-[#05070a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          className="absolute top-[62px] left-0 w-full h-full object-cover opacity-60"
          alt="Background"
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png"
        />
      </div>

      {/* Top navigation bar */}
      <div className="relative z-30">
        <TopBar
          onMenuToggle={() => setSidebarOpen(true)}
          logoSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo.png"
          avatarSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/avatar.png"
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 relative z-10">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col gap-6 p-4 sm:p-8 min-w-0 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

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
              <div className="bg-[#0b0f14] rounded-2xl p-5 border border-white/5">
                <CandlestickChart />
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
  );
};
