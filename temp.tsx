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
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";



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
  return (
    <AdvancedRealTimeChart
      theme="dark"
      symbol="BINANCE:BTCUSDT"
      interval="5"
      hide_top_toolbar={true}
      hide_legend={true}
      allow_symbol_change={false}
      save_image={false}
      autosize
    />
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
    <div className="flex flex-col h-screen bg-[#05070a] text-white font-inter overflow-hidden relative">
      
      {/* Background Images */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070a]">
        <img
          src="/images/bg-lines.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <img
          src="/images/bg-lines1.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
        />
      </div>

      {/* Content wrapper with z-index */}
      <div className="flex flex-col h-full relative z-10 overflow-hidden">
        
        {/* ═══ Top Header ═══ */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-md shrink-0 z-50">
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
        <div className="flex flex-1 overflow-hidden py-4 pr-4 gap-4">

          {/* Left Toolbar */}
          <div className="flex flex-col items-center w-14 gap-5 shrink-0 pt-2">
            {[Navigation, Crosshair, Pencil, Type, TrendingUp, Users].map((Icon, i) => (
              <button key={i} className="text-gray-500 hover:text-[#00ffa3] bg-transparent border-none cursor-pointer transition-colors p-1">
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Center Area (Chart & Order Book + Positions) */}
          <div className="flex flex-col flex-1 min-w-0 gap-4">
            
            {/* Top Row: Chart + Order Book */}
            <div className="flex flex-1 gap-4 overflow-hidden min-h-[300px]">
              
              {/* Chart Panel */}
              <div className="flex flex-col flex-1 bg-[#0a0e14]/90 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                {/* Pair + Timeframe bar */}
                <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5 bg-transparent">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#f7931a] flex items-center justify-center text-[9px] font-bold text-white">₿</div>
                    <span className="font-bold text-sm text-white">BTC/USDT</span>
                    <span className="text-[#00ffa3] bg-[#00ffa3]/10 px-1.5 py-0.5 rounded text-[10px] font-bold">+70.5%</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
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
                {/* Chart Window */}
                <div className="flex-1 relative bg-transparent">
                  <TradingChart />
                </div>
              </div>

              {/* Order Book Panel */}
              <div className="w-[260px] bg-[#0a0e14]/90 backdrop-blur-md rounded-xl border border-white/5 flex flex-col overflow-hidden shrink-0">
            
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
              <span className="text-[10px] text-gray-500 font-bold tracking-widest">UPDOWN PROTOCOL V2.4.1</span>
            </div>
          </div>
        </div>

        {/* Order Book + Trade Panel */}
        <div className="flex shrink-0">

          {/* Order Book */}
          <div className="w-[200px] border-l border-white/5 bg-[#070b10] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">Order Book</span>
                  <div className="flex gap-1.5 border border-white/10 rounded overflow-hidden">
                    <button className="w-6 h-5 bg-white/5 flex items-center justify-center border-none cursor-pointer hover:bg-white/10 p-0">
                      <div className="w-3 h-2 rounded-sm bg-gradient-to-b from-[#00ffa3] to-[#ff4d4d]" />
                    </button>
                    <button className="w-6 h-5 bg-transparent flex items-center justify-center border-none cursor-pointer hover:bg-white/10 p-0">
                      <div className="w-3 h-2 rounded-sm bg-[#00ffa3]" />
                    </button>
                    <button className="w-6 h-5 bg-transparent flex items-center justify-center border-none cursor-pointer hover:bg-white/10 p-0">
                      <div className="w-3 h-2 rounded-sm bg-[#ff4d4d]" />
                    </button>
                  </div>
                </div>

                {/* Header */}
                <div className="grid grid-cols-3 px-4 py-1.5">
              <span className="text-[8px] text-gray-600 font-semibold">PRICE (USDT)</span>
              <span className="text-[8px] text-gray-600 font-semibold text-right">SIZE (BTC)</span>
              <span className="text-[8px] text-gray-600 font-semibold text-right">SUM</span>
            </div>

                {/* Asks (red) */}
                <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1">
                  {askRows.map((row, i) => (
                    <div key={`ask-${i}`} className="grid grid-cols-3 py-[3px] relative cursor-pointer hover:bg-white/5 transition-colors">
                      <div className="absolute right-0 top-0 bottom-0 bg-[#ff4d4d]/10" style={{ width: `${Math.min(parseFloat(row.total) / 2.5 * 100, 100)}%` }} />
                      <span className="text-[11px] text-[#ff4d4d] font-semibold relative z-10">{row.price}</span>
                      <span className="text-[11px] text-gray-300 text-right relative z-10">{row.size}</span>
                      <span className="text-[11px] text-gray-400 text-right relative z-10">{row.total}</span>
                    </div>
                  ))}
                </div>

                {/* Current price */}
                <div className="px-4 py-2 border-y border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <span className="text-[15px] font-bold text-[#00ffa3]">68,432.10</span>
                  <span className="text-[10px] text-gray-500 font-medium">Spread 2.90</span>
                </div>

                {/* Bids (green) */}
                <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1">
                  {bidRows.map((row, i) => (
                    <div key={`bid-${i}`} className="grid grid-cols-3 py-[3px] relative cursor-pointer hover:bg-white/5 transition-colors">
                      <div className="absolute right-0 top-0 bottom-0 bg-[#00ffa3]/10" style={{ width: `${Math.min(parseFloat(row.total) / 3 * 100, 100)}%` }} />
                      <span className="text-[11px] text-[#00ffa3] font-semibold relative z-10">{row.price}</span>
                      <span className="text-[11px] text-gray-300 text-right relative z-10">{row.size}</span>
                      <span className="text-[11px] text-gray-400 text-right relative z-10">{row.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Panel (Positions, etc) */}
            <div className="relative flex flex-col bg-[#05070a]/90 backdrop-blur-md rounded-xl shrink-0 border border-[#00ffa3]/20 shadow-[0_4px_30px_rgba(0,255,163,0.05)] border-t-white/10 before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">

          {/* Trade Panel */}
          <div className="w-[300px] shrink-0 bg-[#0a0e14]/90 backdrop-blur-md rounded-xl border border-white/5 flex flex-col p-5 gap-5">
            <span className="text-base font-bold text-white tracking-tight">TRADE</span>

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
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Price</span>
                <span className="text-[11px] text-gray-500">USDT</span>
              </div>
              <div className="bg-[#111820] rounded-xl px-4 py-3 border border-white/5">
                <span className="text-[15px] font-bold text-white">68,432.10</span>
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Size</span>
                <span className="text-[11px] text-gray-500">BTC</span>
              </div>
              <div className="bg-[#111820] rounded-xl px-4 py-3 border border-white/5">
                <span className="text-[15px] font-bold text-gray-400">0.00</span>
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
            <div className="flex justify-between items-center py-2 border-t border-white/5 mt-2">
              <span className="text-[11px] text-gray-400 font-medium">Available Balance</span>
              <span className="text-[13px] font-bold text-white">12,450.00 USDT</span>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00ffa3] to-[#00d2ff] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(0,255,163,0.3)]">
                <span className="font-bold text-[#05070a] text-[15px] tracking-wide">BUY / LONG</span>
                <span className="text-[10px] text-[#05070a]/70 font-semibold tracking-widest uppercase">PRICE: 68,432.10</span>
              </button>
              <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff4d4d] to-[#ff2a2a] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(255,77,77,0.3)]">
                <span className="font-bold text-white text-[15px] tracking-wide">SELL / SHORT</span>
                <span className="text-[10px] text-white/70 font-semibold tracking-widest uppercase">PRICE: 68,432.10</span>
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
