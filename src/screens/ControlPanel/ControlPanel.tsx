import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

/* ─── Shared Wrapper ─── */
const GradientBorderPanel = ({ children, width, height, className = "" }: { children: React.ReactNode, width?: string, height?: string, className?: string }) => (
  <div 
    className={`p-[1px] rounded-[12px] bg-gradient-to-b from-[#2CF6C3] to-[#013226] shrink-0 flex flex-col ${className}`} 
    style={{ width, height }}
  >
    <div className="bg-[#05070A] rounded-[11px] w-full h-full flex flex-col overflow-hidden relative">
      {children}
    </div>
  </div>
);

/* ─── Chart Component ─── */
const TradingChart = () => {
  return (
    <AdvancedRealTimeChart
      theme="dark"
      symbol="BINANCE:BTCUSDT"
      interval="5"
      hide_legend={true}
      allow_symbol_change={false}
      save_image={false}
      backgroundColor="#05070A"
      autosize
    />
  );
};

/* ─── Main Component ─── */
export const ControlPanel = (): JSX.Element => {
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Trigger">("Limit");
  const [bottomTab, setBottomTab] = useState("positions");
  const [topNav, setTopNav] = useState("Trading");
  const [percent, setPercent] = useState(0);

  // Order Book view
  const [orderBookView, setOrderBookView] = useState<"both" | "bids" | "asks">("both");
  const [marginType, setMarginType] = useState<"CROSS" | "ISOLATED">("CROSS");
  const [marginDropdownOpen, setMarginDropdownOpen] = useState(false);
  
  const [leverage, setLeverage] = useState(10);
  const [leverageDropdownOpen, setLeverageDropdownOpen] = useState(false);

  // Editable fields
  const [priceInput, setPriceInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Live Market Data
  const [currentPrice, setCurrentPrice] = useState("...");
  // const [priceNumeric, setPriceNumeric] = useState("0");
  const [priceChangePercent, setPriceChangePercent] = useState("0.00");
  const [isPositive, setIsPositive] = useState(true);
  const [asks, setAsks] = useState<{price: string, size: string, total: string}[]>([]);
  const [bids, setBids] = useState<{price: string, size: string, total: string}[]>([]);

  useEffect(() => {
    // 1. Ticker for current price + 24h change
    const tickerWs = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
    tickerWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.c) {
        // setPriceNumeric(data.c);
        setCurrentPrice(parseFloat(data.c).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        const change = parseFloat(data.P);
        setPriceChangePercent(change.toFixed(2));
        setIsPositive(change >= 0);
        
        // Auto-fill price input once on load if it's empty
        setPriceInput((prev) => prev === "" ? parseFloat(data.c).toFixed(2) : prev);
      }
    };

    // 2. Orderbook depth (20 levels, updated every 1000ms for smoothness)
    const depthWs = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@depth20@1000ms");
    depthWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.bids && data.asks) {
        // Parse Bids
        let currentBidTotal = 0;
        const newBids = data.bids.slice(0, 20).map((b: string[]) => {
          const price = parseFloat(b[0]);
          const size = parseFloat(b[1]);
          currentBidTotal += size;
          return {
            price: price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            size: size.toFixed(3),
            total: currentBidTotal.toFixed(3)
          };
        });
        
        // Parse Asks (highest to lowest for UI, Binance sends lowest first)
        let currentAskTotal = 0;
        const newAsks = data.asks.slice(0, 20).map((a: string[]) => {
          const price = parseFloat(a[0]);
          const size = parseFloat(a[1]);
          currentAskTotal += size;
          return {
            price: price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            size: size.toFixed(3),
            total: currentAskTotal.toFixed(3)
          };
        }).reverse();

        setBids(newBids);
        setAsks(newAsks);
      }
    };

    return () => {
      tickerWs.close();
      depthWs.close();
    };
  }, []);

  const topNavItems = ["Trading", "Markets", "Balance", "Tournaments", "History", "Settings"];
  const bottomTabs = [
    { id: "positions", label: "POSITIONS (0)" },
    { id: "open-orders", label: "OPEN ORDERS (0)" },
    { id: "order-history", label: "ORDER HISTORY" },
    { id: "trade-history", label: "TRADE HISTORY" },
    { id: "assets", label: "ASSETS" },
  ];
  const positionCols = ["SIZE", "ENTRY PRICE", "MARK PRICE", "LIQ.PRICE", "MARGIN/RATIO", "PNL (ROE%)"];

  return (
    <div className="flex flex-col h-screen bg-[#05070A] text-white font-inter overflow-hidden relative">
      
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
        <header className="flex items-center justify-between h-14 px-4 border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md shrink-0 z-50">
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
            <button className="bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-bold text-[11px] px-5 py-2.5 rounded-full border-none cursor-pointer transition-colors">
              DEPOSIT
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00ffa3] to-[#0ea5e9] text-xs font-bold text-black border border-white/10">
              A
            </div>
            <button className="text-[#00ffa3] hover:text-[#00e693] bg-transparent border-none cursor-pointer transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* ═══ Main Grid ═══ */}
        <div className="flex flex-col flex-1 p-4 gap-4 overflow-hidden">

          {/* Top Row: Left area (Chart + Order Book) + Right area (Trade Panel) */}
          <div className="flex flex-1 gap-4 overflow-hidden min-h-[300px]">
            
            {/* Left Side (Chart + Order Book) */}
            <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
              
              {/* Chart Panel */}
              <GradientBorderPanel className="flex-1">
                {/* Pair Header */}
                <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#05070A] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#f7931a] flex items-center justify-center text-[9px] font-bold text-white">₿</div>
                    <span className="font-bold text-[15px] tracking-wide text-white">BTC/USDT</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isPositive ? 'text-[#00ffa3] bg-[#00ffa3]/10' : 'text-[#ff4d4d] bg-[#ff4d4d]/10'}`}>
                      {isPositive ? '+' : ''}{priceChangePercent}%
                    </span>
                  </div>
                </div>
                {/* Chart Window */}
                <div className="flex-1 relative bg-[#05070A] min-h-0">
                  <TradingChart />
                </div>
              </GradientBorderPanel>

              {/* Order Book Panel */}
              <GradientBorderPanel width="273px">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                  <span className="text-[10px] font-bold text-[#A6B2C8] tracking-wider uppercase">Order Book</span>
                  <div className="flex bg-[#111820] rounded-[6px] p-0.5 gap-0.5">
                    <button onClick={() => setOrderBookView("both")} className={`w-[28px] h-[22px] rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors p-0 ${orderBookView === "both" ? "bg-[#2A3441]" : "bg-transparent hover:bg-[#2A3441]"}`}>
                      <div className="w-[14px] h-[10px] rounded-[2px] bg-gradient-to-b from-[#ff4d4d] to-[#00ffa3]" />
                    </button>
                    <button onClick={() => setOrderBookView("bids")} className={`w-[28px] h-[22px] rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors p-0 ${orderBookView === "bids" ? "bg-[#2A3441]" : "bg-transparent hover:bg-[#2A3441]"}`}>
                      <div className="w-[14px] h-[10px] rounded-[2px] bg-[#00ffa3]" />
                    </button>
                    <button onClick={() => setOrderBookView("asks")} className={`w-[28px] h-[22px] rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors p-0 ${orderBookView === "asks" ? "bg-[#2A3441]" : "bg-transparent hover:bg-[#2A3441]"}`}>
                      <div className="w-[14px] h-[10px] rounded-[2px] bg-[#ff4d4d]" />
                    </button>
                  </div>
                </div>

                {/* Header */}
                <div className="grid grid-cols-3 px-4 py-1.5 shrink-0">
                  <span className="text-[8px] text-[#A6B2C8] font-semibold tracking-wide uppercase">Price</span>
                  <span className="text-[8px] text-[#A6B2C8] font-semibold tracking-wide text-right uppercase">Size</span>
                  <span className="text-[8px] text-[#A6B2C8] font-semibold tracking-wide text-right uppercase">Sum</span>
                </div>

                {/* Asks (red) */}
                {orderBookView !== "bids" && (
                  <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1 justify-end pb-1 border-b border-[#05070A]/50">
                    {(orderBookView === "asks" ? asks : asks.slice(-10)).map((row, i) => (
                      <div key={`ask-${i}`} onClick={() => setPriceInput(row.price.replace(/,/g, ''))} className="grid grid-cols-3 py-[2px] relative cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="text-[11px] text-[#ff4d4d] font-semibold relative z-10">{row.price}</span>
                        <span className="text-[11px] text-gray-300 text-right relative z-10 font-mono">{row.size}</span>
                        <span className="text-[11px] text-gray-500 text-right relative z-10 font-mono">{row.total}</span>
                      </div>
                    ))}
                    {asks.length === 0 && <div className="text-[10px] text-gray-600 px-2 flex-1 flex items-center justify-center">Loading Data...</div>}
                  </div>
                )}

                {/* Current price */}
                <div className="px-4 py-2 border-y border-white/5 flex items-center gap-2 bg-[#05070A] shrink-0">
                  <span className={`text-[15px] font-bold ${isPositive ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>{currentPrice}</span>
                </div>

                {/* Bids (green) */}
                {orderBookView !== "asks" && (
                  <div className="flex flex-col px-4 flex-1 overflow-hidden pt-1 justify-start">
                    {(orderBookView === "bids" ? bids : bids.slice(0, 10)).map((row, i) => (
                      <div key={`bid-${i}`} onClick={() => setPriceInput(row.price.replace(/,/g, ''))} className="grid grid-cols-3 py-[2px] relative cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="text-[11px] text-[#00ffa3] font-semibold relative z-10">{row.price}</span>
                        <span className="text-[11px] text-gray-300 text-right relative z-10 font-mono">{row.size}</span>
                        <span className="text-[11px] text-gray-500 text-right relative z-10 font-mono">{row.total}</span>
                      </div>
                    ))}
                    {bids.length === 0 && <div className="text-[10px] text-gray-600 px-2 flex-1 flex items-center justify-center">Loading Data...</div>}
                  </div>
                )}
              </GradientBorderPanel>
            </div>

            {/* Trade Panel */}
            <GradientBorderPanel width="273px" className="shrink-0">
              <div className="flex flex-col p-4 h-full">
                <span className="text-sm font-bold text-[#A6B2C8] tracking-wider uppercase mb-5 mt-1">Trade</span>

                {/* Order type toggle */}
                <div className="flex gap-1 bg-[#111820] rounded-xl p-1 mb-5">
                  {(["Limit", "Market", "Trigger"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg border-none cursor-pointer transition-colors ${
                        orderType === type
                          ? "bg-[#00FFA3] text-[#05070A]"
                          : "bg-transparent text-gray-500 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Margin Type / Leverage */}
                <div className="flex gap-2 mb-5 relative">
                  {/* Margin Dropdown Container */}
                  <div className="flex-1 relative flex flex-col">
                    <div 
                      onClick={() => { setMarginDropdownOpen(!marginDropdownOpen); setLeverageDropdownOpen(false); }}
                      className="bg-[#111820] rounded-xl px-4 py-2.5 flex flex-1 items-center justify-between cursor-pointer border border-[#111820] hover:border-white/10 transition-colors"
                    >
                      <span className="text-[11px] text-white font-bold">{marginType}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="white"><path d="M0 0l5 6 5-6z"/></svg>
                    </div>
                    
                    {marginDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#111820] border border-white/10 rounded-lg z-50 overflow-hidden shadow-2xl py-1">
                        {["CROSS", "ISOLATED"].map(type => (
                          <div
                            key={type}
                            onClick={() => { setMarginType(type as any); setMarginDropdownOpen(false); }}
                            className={`px-4 py-2 text-[11px] font-bold cursor-pointer transition-colors ${marginType === type ? "text-[#00ffa3] bg-white/5" : "text-white hover:bg-white/5"}`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Leverage Dropdown Container */}
                  <div className="flex-1 relative flex flex-col">
                    <div 
                      onClick={() => { setLeverageDropdownOpen(!leverageDropdownOpen); setMarginDropdownOpen(false); }}
                      className="bg-[#111820] rounded-xl px-4 py-2.5 flex flex-1 items-center justify-between cursor-pointer border border-[#111820] hover:border-white/10 transition-colors"
                    >
                      <span className="text-[11px] text-white font-bold">{leverage}x</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="white"><path d="M0 0l5 6 5-6z"/></svg>
                    </div>
                    
                    {leverageDropdownOpen && (
                      <div className="absolute right-0 top-[calc(100%+4px)] w-full bg-[#111820] border border-white/10 rounded-lg z-50 shadow-2xl py-1 max-h-[180px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div className="flex flex-col">
                          {[1, 3, 5, 10, 25, 50, 100].map(val => (
                            <div 
                              key={val}
                              onClick={() => { setLeverage(val); setLeverageDropdownOpen(false); }} 
                              className={`px-4 py-2 text-left text-[11px] font-bold cursor-pointer transition-colors ${leverage === val ? "text-[#00ffa3] bg-white/5" : "text-white hover:bg-white/5 bg-transparent"}`}
                            >
                              {val}x
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price (Editable) */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-gray-500 font-bold">Price</span>
                    <span className="text-[11px] text-gray-500">USDT</span>
                  </div>
                  <div className="bg-[#111820] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00ffa3]/30 transition-colors flex items-center">
                    <input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Size (Editable) */}
                <div className="mb-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-gray-500 font-bold">Size</span>
                    <span className="text-[11px] text-gray-500">BTC</span>
                  </div>
                  <div className="bg-[#111820] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00ffa3]/30 transition-colors flex items-center">
                    <input
                      type="number"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-white placeholder-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Timer & Slider */}
                <div className="flex flex-col gap-1 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Timer</span>
                    <span className="text-[18px] font-bold text-white font-mono tracking-wider">00:32</span>
                  </div>
                  
                  <div className="mt-4 px-1">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={percent} 
                      onChange={(e) => {
                        const newPercent = Number(e.target.value);
                        setPercent(newPercent);
                        // Optional: Link slider to sizeInput (e.g. 100% of 0.5 BTC max based on dummy balance)
                        // This makes the slider update the size field dynamically!
                        const dummyBalance = 0.5; // Let's pretend max BTC we can buy is roughly 0.5 BTC with 12k USDT. 
                        const newSize = (dummyBalance * (newPercent / 100));
                        if(newPercent > 0) {
                          setSizeInput(newSize.toFixed(3));
                        } else {
                          setSizeInput("");
                        }
                      }}
                      className="w-full h-[3px] appearance-none cursor-pointer rounded-full outline-none accent-[#00FFA3]"
                      style={{
                        background: `linear-gradient(to right, #00FFA3 ${percent}%, #111820 ${percent}%)`
                      }}
                    />
                    <div className="flex justify-between items-center mt-3">
                      {[0, 25, 50, 75, 100].map((p) => (
                        <button 
                          key={p} 
                          onClick={() => {
                            setPercent(p);
                            const dummyBalance = 0.5;
                            const newSize = (dummyBalance * (p / 100));
                            setSizeInput(p > 0 ? newSize.toFixed(3) : "");
                          }} 
                          className={`text-[9px] font-bold bg-transparent border-none cursor-pointer transition-colors ${percent === p ? "text-[#00FFA3]" : "text-gray-500 hover:text-white"}`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Balance */}
                <div className="flex justify-between items-center mt-auto mb-4">
                  <span className="text-[12px] text-gray-500">Available Balance</span>
                  <span className="text-[12px] font-bold text-white">12,450.00 USDT</span>
                </div>

                {/* Buy / Sell Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button className="w-full h-[45px] rounded-[10px] bg-gradient-to-b from-[#00FFA3] to-[#009962] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.3)]">
                    <span className="font-bold text-[#05070a] text-[15px] tracking-wide leading-none mb-0.5">BUY / LONG</span>
                    <span className="text-[9px] text-[#05070a]/80 font-bold tracking-widest uppercase leading-none">PRICE: {priceInput || currentPrice}</span>
                  </button>
                  <button className="w-full h-[45px] rounded-[10px] bg-gradient-to-b from-[#FF3B3B] to-[#992323] hover:brightness-110 border-none cursor-pointer transition-all flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,59,59,0.3)]">
                    <span className="font-bold text-white text-[15px] tracking-wide leading-none mb-0.5">SELL / SHORT</span>
                    <span className="text-[9px] text-white/80 font-bold tracking-widest uppercase leading-none">PRICE: {priceInput || currentPrice}</span>
                  </button>
                </div>
              </div>
            </GradientBorderPanel>
          </div>

          {/* Bottom Row: Positions Panel (Spanning full width!) */}
          <GradientBorderPanel height="255px" className="w-full shrink-0">
            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 pt-3 border-b border-white/5 shrink-0">
              {bottomTabs.map((tab) => {
                const isActive = bottomTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBottomTab(tab.id)}
                    className={`pb-3 text-[11px] font-bold tracking-wider border-none cursor-pointer transition-all relative ${isActive ? "text-[#00ffa3] drop-shadow-[0_0_6px_rgba(0,255,163,0.8)]" : "text-[#A6B2C8] hover:text-white"}`}
                    style={{ background: "transparent", minWidth: "max-content" }}
                  >
                    {tab.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00ffa3] shadow-[0_0_8px_rgba(0,255,163,1)] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-2 px-6 py-4 border-b border-white/5 shrink-0">
              {positionCols.map((col) => (
                <span key={col} className="text-[10px] text-[#A6B2C8] font-semibold tracking-[0.5px] uppercase">{col}</span>
              ))}
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
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
            <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-[#05070A] shrink-0">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] shadow-[0_0_5px_#00ffa3]" />
                  <span className="text-[10.5px] text-[#afc0c9]">Connection: Secure</span>
                </div>
                <span className="text-[10.5px] text-[#89a4ad]">Server Time: 14:22:15 (UTC)</span>
              </div>
              <span className="text-[10px] text-[#A6B2C8] font-bold tracking-widest">HEDGE PROTOCOL V2.4.1</span>
            </div>
          </GradientBorderPanel>
        </div>
      </div>
    </div>
  );
};
