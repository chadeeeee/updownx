import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navigation,
  Pencil,
  Type,
  TrendingUp,
  Users,
  CircleHelp,
  Crosshair,
} from "lucide-react";

/* ─── Candlestick data ─── */
const candles = [
  { o: 58.5, c: 59.2, h: 59.8, l: 58.0 },
  { o: 59.2, c: 58.0, h: 59.5, l: 57.5 },
  { o: 58.0, c: 59.5, h: 60.0, l: 57.8 },
  { o: 59.5, c: 58.8, h: 60.2, l: 58.5 },
  { o: 58.8, c: 60.5, h: 61.0, l: 58.5 },
  { o: 60.5, c: 59.0, h: 61.2, l: 58.8 },
  { o: 59.0, c: 61.5, h: 62.0, l: 58.8 },
  { o: 61.5, c: 62.0, h: 62.5, l: 61.0 },
  { o: 62.0, c: 60.5, h: 62.3, l: 60.0 },
  { o: 60.5, c: 62.5, h: 63.0, l: 60.0 },
  { o: 62.5, c: 61.0, h: 63.0, l: 60.5 },
  { o: 61.0, c: 63.0, h: 63.5, l: 60.8 },
  { o: 63.0, c: 62.0, h: 63.8, l: 61.5 },
  { o: 62.0, c: 63.5, h: 64.0, l: 61.8 },
  { o: 63.5, c: 65.0, h: 65.5, l: 63.0 },
  { o: 65.0, c: 64.0, h: 65.8, l: 63.5 },
  { o: 64.0, c: 66.0, h: 66.5, l: 63.8 },
  { o: 66.0, c: 67.0, h: 67.5, l: 65.5 },
  { o: 67.0, c: 66.5, h: 68.0, l: 66.0 },
  { o: 66.5, c: 67.8, h: 68.2, l: 66.0 },
  { o: 67.8, c: 67.0, h: 68.5, l: 66.5 },
  { o: 67.0, c: 68.0, h: 68.8, l: 66.8 },
  { o: 68.0, c: 67.5, h: 68.5, l: 67.0 },
  { o: 67.5, c: 68.5, h: 69.0, l: 67.0 },
];

const timeLabels = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const priceLevels = [69.0, 68.225, 67.857, 63.168, 62.0, 61.905, 60.857, 59.168, 58.354, 52.168, 50.0];

/* ─── Order book data ─── */
const askRows = [
  { price: "68,435.00", size: "0.360", total: "0.360" },
  { price: "68,434.50", size: "0.115", total: "0.475" },
  { price: "68,434.00", size: "1.250", total: "1.725" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
  { price: "68,433.50", size: "0.420", total: "2.145" },
];

const bidRows = [
  { price: "68,431.10", size: "0.850", total: "0.850" },
  { price: "68,428.50", size: "2.100", total: "2.950" },
  { price: "68,428.50", size: "0.045", total: "2.995" },
  { price: "68,425.00", size: "0.045", total: "2.995" },
  { price: "68,425.00", size: "0.045", total: "2.995" },
  { price: "68,425.00", size: "0.045", total: "2.995" },
  { price: "68,425.00", size: "0.045", total: "2.995" },
  { price: "68,428.50", size: "2.100", total: "2.950" },
  { price: "68,428.50", size: "2.100", total: "2.950" },
];

/* ─── Chart Component ─── */
const TradingChart = () => {
  const W = 600;
  const H = 420;
  const pad = { top: 10, right: 60, bottom: 30, left: 10 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const minP = 50;
  const maxP = 69.5;
  const range = maxP - minP;
  const barW = cW / candles.length;

  const yScale = (p: number) => pad.top + cH - ((p - minP) / range) * cH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {priceLevels.map((p, i) => {
        const y = yScale(p);
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#111a24" strokeWidth={0.5} strokeDasharray="2,4" />
            <text x={W - pad.right + 6} y={y + 3} fill="#4a5568" fontSize="8" fontFamily="Inter">
              {p.toFixed(3)}
            </text>
          </g>
        );
      })}

      {/* Time labels */}
      {timeLabels.map((t, i) => (
        <text
          key={i}
          x={pad.left + (i / (timeLabels.length - 1)) * cW}
          y={H - 6}
          fill="#4a5568"
          fontSize="8"
          fontFamily="Inter"
          textAnchor="middle"
        >
          {t}
        </text>
      ))}

      {/* Candles */}
      {candles.map((c, i) => {
        const x = pad.left + i * barW + barW * 0.2;
        const w = barW * 0.6;
        const isGreen = c.c >= c.o;
        const color = isGreen ? "#00ffa3" : "#ff4d4d";
        const bodyTop = yScale(Math.max(c.o, c.c));
        const bodyBot = yScale(Math.min(c.o, c.c));
        const bodyH = Math.max(bodyBot - bodyTop, 1);

        return (
          <g key={i}>
            <line x1={x + w / 2} y1={yScale(c.h)} x2={x + w / 2} y2={yScale(c.l)} stroke={color} strokeWidth={1} />
            <rect x={x} y={bodyTop} width={w} height={bodyH} fill={color} rx={1} />
          </g>
        );
      })}

      {/* Current price marker */}
      <line x1={pad.left} y1={yScale(68.432)} x2={W - pad.right} y2={yScale(68.432)} stroke="#00ffa3" strokeWidth={0.5} strokeDasharray="4,3" />
    </svg>
  );
};

/* ─── Main Component ─── */
export const ControlPanel = (): JSX.Element => {
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Trigger">("Limit");
  const [timeframe, setTimeframe] = useState("5m");
  const [bottomTab, setBottomTab] = useState("positions");
  const [topNav, setTopNav] = useState("Trading");

  const topNavItems = ["Trading", "Markets", "Balance", "Tournaments", "History", "Settings"];
  const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1D"];
  const bottomTabs = [
    { id: "positions", label: "POSITIONS (0)" },
    { id: "open-orders", label: "OPEN ORDERS (0)" },
    { id: "order-history", label: "ORDER HISTORY" },
    { id: "trade-history", label: "TRADE HISTORY" },
    { id: "assets", label: "ASSETS" },
  ];
  const positionCols = ["SIZE", "ENTRY PRICE", "MARK PRICE", "LIQ.PRICE", "MARGIN/RATIO", "PNL (ROE%)"];

  return (
    <div className="flex flex-col h-screen bg-[#05070a] text-white font-inter overflow-hidden">

      {/* ═══ Top Header ═══ */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-white/5 bg-[#070b10] shrink-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="UPDOWNX" className="h-7 w-auto" />
          </Link>
          <nav className="flex items-center gap-1">
            {topNavItems.map((item) => (
              <button
                key={item}
                onClick={() => setTopNav(item)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-colors ${
                  topNav === item
                    ? "text-[#00ffa3]"
                    : "text-gray-400 hover:text-white bg-transparent"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[9px] text-gray-500 font-semibold tracking-wider uppercase">Balance</span>
            <span className="text-sm font-bold text-white">1,530.45 <span className="text-gray-400 text-xs">USDT</span></span>
          </div>
          <button className="bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-bold text-xs px-5 py-2 rounded-xl border-none cursor-pointer transition-colors">
            DEPOSIT
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00ffa3] to-[#0ea5e9] text-xs font-bold text-black">
            A
          </div>
          <button className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* ═══ Main Grid ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Toolbar */}
        <div className="flex flex-col items-center w-12 bg-[#070b10] border-r border-white/5 py-4 gap-5 shrink-0">
          {[Navigation, Crosshair, Pencil, Type, TrendingUp, Users].map((Icon, i) => (
            <button key={i} className="text-gray-500 hover:text-[#00ffa3] bg-transparent border-none cursor-pointer transition-colors p-1">
              <Icon size={18} />
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Pair + Timeframe bar */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#070b10]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#f7931a] flex items-center justify-center text-[9px] font-bold text-white">₿</div>
              <span className="font-bold text-sm text-white">BTC/USDT</span>
              <span className="text-[#00ffa3] text-xs font-semibold">+70.5%</span>
            </div>
            <div className="flex items-center gap-0.5 ml-auto">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded border-none cursor-pointer transition-colors ${
                    timeframe === tf
                      ? "text-[#00ffa3] bg-[#00ffa3]/10"
                      : "text-gray-500 bg-transparent hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 relative bg-[#0a0e14] mb-4">
            <TradingChart />
          </div>

          {/* Bottom Panel (Tabs, Table, Footer) */}
          <div className="relative flex flex-col bg-[#05070a] rounded-xl mx-4 mb-4 shrink-0 before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
            
            {/* Tabs */}
            <div className="flex justify-center items-center gap-4 sm:gap-8 px-4 pt-3 border-b border-white/5 relative z-10 w-[90%] mx-auto">
              {bottomTabs.map((tab) => {
                const isActive = bottomTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBottomTab(tab.id)}
                    className={`pb-3 text-[11px] font-bold tracking-wider border-none cursor-pointer transition-all relative ${isActive ? "text-[#00ffa3] drop-shadow-[0_0_6px_rgba(0,255,163,0.8)]" : "text-gray-500 hover:text-white"}`}
                    style={{ background: "transparent", minWidth: "max-content" }}
                  >
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ffa3] shadow-[0_0_8px_rgba(0,255,163,1)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-2 px-6 py-4 border-b border-white/5 relative z-10 w-[85%] mx-auto">
              {positionCols.map((col) => (
                <span key={col} className="text-[10px] text-gray-500 font-semibold tracking-[0.5px] uppercase text-center">{col}</span>
              ))}
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-10 gap-3 relative z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
                <circle cx="16" cy="15" r="2" />
                <path d="M16 13v-1" />
                <path d="M16 18v-1" />
                <path d="M18.5 15h-1" />
                <path d="M14.5 15h-1" />
              </svg>
              <span className="text-gray-500 text-[11px]">No Open Positions</span>
            </div>

            {/* Module Footer */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_5px_#00ffa3]" />
                  <span className="text-[10.5px] text-[#afc0c9]">Connection: Secure</span>
                </div>
                <span className="text-[10.5px] text-[#89a4ad]">Server Time: 14:22:15 (UTC)</span>
              </div>
              <span className="text-[10px] text-gray-500 font-bold tracking-widest">HEDGE PROTOCOL V2.4.1</span>
            </div>
          </div>
        </div>

        {/* Order Book + Trade Panel */}
        <div className="flex shrink-0">

          {/* Order Book */}
          <div className="w-[200px] border-l border-white/5 bg-[#070b10] flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Order Book</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-[#00ffa3]/20" />
                <div className="w-3 h-3 rounded bg-[#ff4d4d]/20" />
              </div>
            </div>

            {/* Header */}
            <div className="grid grid-cols-3 px-3 py-1">
              <span className="text-[8px] text-gray-600 font-semibold">PRICE (USDT)</span>
              <span className="text-[8px] text-gray-600 font-semibold text-right">SIZE (BTC)</span>
              <span className="text-[8px] text-gray-600 font-semibold text-right">SUM</span>
            </div>

            {/* Asks (red) */}
            <div className="flex flex-col px-3 flex-1 overflow-hidden">
              {askRows.map((row, i) => (
                <div key={`ask-${i}`} className="grid grid-cols-3 py-[2px] relative">
                  <div className="absolute right-0 top-0 bottom-0 bg-[#ff4d4d]/8" style={{ width: `${Math.min(parseFloat(row.total) / 2.5 * 100, 100)}%` }} />
                  <span className="text-[10px] text-[#ff4d4d] font-medium relative z-10">{row.price}</span>
                  <span className="text-[10px] text-gray-300 text-right relative z-10">{row.size}</span>
                  <span className="text-[10px] text-gray-400 text-right relative z-10">{row.total}</span>
                </div>
              ))}
            </div>

            {/* Current price */}
            <div className="px-3 py-2 border-y border-white/5 flex items-center gap-2">
              <span className="text-sm font-bold text-[#00ffa3]">68,432.10</span>
              <span className="text-[9px] text-gray-500">Spread 2.90</span>
            </div>

            {/* Bids (green) */}
            <div className="flex flex-col px-3 flex-1 overflow-hidden">
              {bidRows.map((row, i) => (
                <div key={`bid-${i}`} className="grid grid-cols-3 py-[2px] relative">
                  <div className="absolute right-0 top-0 bottom-0 bg-[#00ffa3]/8" style={{ width: `${Math.min(parseFloat(row.total) / 3 * 100, 100)}%` }} />
                  <span className="text-[10px] text-[#00ffa3] font-medium relative z-10">{row.price}</span>
                  <span className="text-[10px] text-gray-300 text-right relative z-10">{row.size}</span>
                  <span className="text-[10px] text-gray-400 text-right relative z-10">{row.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Panel */}
          <div className="w-[200px] border-l border-white/5 bg-[#0a0e14] flex flex-col p-4 gap-4">
            <span className="text-sm font-bold text-white tracking-tight">TRADE</span>

            {/* Order type toggle */}
            <div className="flex gap-1 bg-[#111820] rounded-lg p-0.5">
              {(["Limit", "Market", "Trigger"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md border-none cursor-pointer transition-colors ${
                    orderType === type
                      ? "bg-[#00ffa3] text-[#05070a]"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Cross / Leverage */}
            <div className="flex gap-2">
              <div className="flex-1 bg-[#111820] rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-300 font-medium">CROSS</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="#666"><path d="M0 0l5 6 5-6z"/></svg>
              </div>
              <div className="flex-1 bg-[#111820] rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] text-[#00ffa3] font-bold">5X</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="#666"><path d="M0 0l5 6 5-6z"/></svg>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500">Price</span>
                <span className="text-[10px] text-gray-500">USDT</span>
              </div>
              <div className="bg-[#111820] rounded-lg px-3 py-2.5">
                <span className="text-sm font-bold text-white">68,432.10</span>
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500">Size</span>
                <span className="text-[10px] text-gray-500">BTC</span>
              </div>
              <div className="bg-[#111820] rounded-lg px-3 py-2.5">
                <span className="text-sm font-bold text-white">0.00</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Timer</span>
              <span className="text-sm font-bold text-white font-mono">00:32</span>
            </div>
            <div className="w-full h-1.5 bg-[#111820] rounded-full overflow-hidden">
              <div className="h-full bg-[#00ffa3] rounded-full transition-all" style={{ width: "53%" }} />
            </div>

            {/* Percentage */}
            <div className="flex justify-between">
              {["0%", "25%", "50%", "75%", "100%"].map((p) => (
                <span key={p} className="text-[9px] text-gray-600">{p}</span>
              ))}
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500">Available Balance</span>
              <span className="text-xs font-bold text-white">12,450.00 USDT</span>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <button className="w-full py-3 rounded-xl bg-[#00ffa3] hover:bg-[#00e693] border-none cursor-pointer transition-colors flex flex-col items-center gap-0.5">
                <span className="font-bold text-[#05070a] text-sm">BUY / LONG</span>
                <span className="text-[9px] text-[#05070a]/60">PRICE: 68,432.10</span>
              </button>
              <button className="w-full py-3 rounded-xl bg-[#ff4d4d] hover:bg-[#e64444] border-none cursor-pointer transition-colors flex flex-col items-center gap-0.5">
                <span className="font-bold text-white text-sm">SELL / SHORT</span>
                <span className="text-[9px] text-white/60">PRICE: 68,432.10</span>
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Floating help */}
      <button className="fixed bottom-12 left-4 w-8 h-8 rounded-full bg-[#111820] border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#00ffa3] cursor-pointer transition-colors z-50">
        <CircleHelp size={16} />
      </button>
    </div>
  );
};
