import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart2,
  ChevronDown,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Target,
  Clock,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

type Order = {
  id: number;
  challenge_name: string;
  amount: number;
  status: string;
  created_at: string;
};

type AccountPayload = {
  user: { id: number; name: string; email: string } | null;
  orders: Order[];
};

const TABS = ["TRADER", "CHALLENGE", "WILL BE ACTIVATED", "FAILED"] as const;

/* ─── TradingView Widget ─── */
declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => void;
    };
  }
}

const TradingViewChart = ({ symbol = "BTCUSDT" }: { symbol?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    const load = () => {
      if (!widgetRef.current) return;
      widgetRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `BINANCE:${symbol}`,
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        backgroundColor: "#05070a",
        gridColor: "rgba(0,255,163,0.04)",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        support_host: "https://www.tradingview.com",
      });
      widgetRef.current.appendChild(script);
    };

    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      s.onload = load;
      document.head.appendChild(s);
    } else {
      load();
    }
  }, [symbol]);

  return (
    <div ref={containerRef} className="tradingview-widget-container h-full w-full">
      <div ref={widgetRef} className="tradingview-widget-container__widget h-full w-full" />
    </div>
  );
};

/* ─── Trading Terminal ─── */
const TradeView = ({ order }: { order: Order }) => {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [activeSymbol, setActiveSymbol] = useState("BTCUSDT");
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "Trigger">("Limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("68432.10");
  const [size, setSize] = useState("");
  const [leverage, setLeverage] = useState("5X");
  const [marginType, setMarginType] = useState("CROSS");
  const [activeTab, setActiveTab] = useState("POSITIONS");
  const [sliderPct, setSliderPct] = useState(0);
  const balance =
    order.amount >= 199 ? 100000 : order.amount >= 99 ? 25000 : order.amount >= 49 ? 5000 : 799;

  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
  const leverages = ["1X", "2X", "3X", "5X", "10X", "20X", "50X", "100X"];
  const tabs = ["POSITIONS (0)", "OPEN ORDERS (0)", "ORDER HISTORY", "TRADE HISTORY", "ASSETS"];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-180px)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {symbols.map((s) => (
          <button
            key={s}
            onClick={() => { setActiveSymbol(s); setSymbol(s); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSymbol === s
                ? "bg-[#00FFA3] text-black"
                : "border border-[#163e4a] bg-[#0a1a22] text-[#6e8a94] hover:text-white"
            }`}
          >
            {s.replace("USDT", "/USDT")}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#6e8a94]">
          BALANCE: <span className="font-bold text-[#00FFA3]">{balance.toLocaleString()}.00 USDT</span>
        </span>
      </div>

      <div className="flex flex-1 gap-3" style={{ minHeight: 0 }}>
        {/* Chart area */}
        <div className="flex-1 flex flex-col gap-3" style={{ minWidth: 0 }}>
          <div className="rounded-2xl border border-[#163e4a] bg-[#08141c] overflow-hidden" style={{ height: "420px" }}>
            <TradingViewChart symbol={symbol} />
          </div>

          {/* Positions table */}
          <div className="rounded-2xl border border-[#163e4a] bg-[#08141c] overflow-hidden">
            <div className="flex border-b border-[#163e4a]/50">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t.split(" ")[0])}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === t.split(" ")[0]
                      ? "border-b-2 border-[#00FFA3] text-[#00FFA3]"
                      : "text-[#6e8a94] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 px-4 py-2 border-b border-[#163e4a]/30">
              {["SIZE", "ENTRY PRICE", "MARK PRICE", "LIQ. PRICE", "MARGIN/RATIO", "PNL (ROE%)"].map((h) => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">{h}</span>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <BarChart2 size={28} className="text-[#2a4e58]" />
              <p className="text-sm text-[#6e8a94]">No Open Positions</p>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#163e4a]/30">
              <span className="flex items-center gap-1.5 text-[10px] text-[#00FFA3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]" />
                Connection: Secure
              </span>
              <span className="text-[10px] text-[#4a6570]">HEDGE PROTOCOL V2.4.1</span>
            </div>
          </div>
        </div>

        {/* Order panel */}
        <div className="w-[260px] flex-shrink-0 rounded-2xl border border-[#163e4a] bg-[#08141c] p-4 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6e8a94]">TRADE</p>

          {/* Order type */}
          <div className="flex rounded-lg border border-[#163e4a] overflow-hidden">
            {(["Limit", "Market", "Trigger"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`flex-1 py-2 text-xs font-bold transition-all ${
                  orderType === t ? "bg-[#00FFA3] text-black" : "text-[#6e8a94] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Margin + Leverage */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={marginType}
                onChange={(e) => setMarginType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#163e4a] bg-[#050f15] px-3 py-2 text-xs font-bold text-white outline-none"
              >
                <option>CROSS</option>
                <option>ISOLATED</option>
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4a6570]" />
            </div>
            <div className="relative flex-1">
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#163e4a] bg-[#050f15] px-3 py-2 text-xs font-bold text-white outline-none"
              >
                {leverages.map((l) => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#4a6570]" />
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">Price</label>
              <span className="text-[10px] text-[#4a6570]">USDT</span>
            </div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-[#163e4a] bg-[#050f15] px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-[#00FFA3]/40"
            />
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">Size</label>
              <span className="text-[10px] text-[#4a6570]">BTC</span>
            </div>
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-[#163e4a] bg-[#050f15] px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-[#00FFA3]/40"
            />
          </div>

          {/* Slider */}
          <div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPct}
              onChange={(e) => setSliderPct(Number(e.target.value))}
              className="w-full accent-[#00FFA3]"
            />
            <div className="flex justify-between text-[10px] text-[#4a6570] mt-1">
              {[0, 25, 50, 75, 100].map((p) => <span key={p}>{p}%</span>)}
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4a6570]">Available Balance</span>
            <span className="text-xs font-bold text-white">{balance.toLocaleString()}.00 USDT</span>
          </div>

          {/* Buy / Sell buttons */}
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => setSide("buy")}
              className={`w-full rounded-xl py-3 text-sm font-black uppercase tracking-wider transition-all ${
                side === "buy"
                  ? "bg-[#00FFA3] text-black shadow-[0_0_16px_rgba(0,255,163,0.3)]"
                  : "bg-[#00FFA3]/20 text-[#00FFA3] hover:bg-[#00FFA3]/30"
              }`}
            >
              BUY / LONG
              <p className="text-[10px] font-normal mt-0.5">PRICE: {price}</p>
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`w-full rounded-xl py-3 text-sm font-black uppercase tracking-wider transition-all ${
                side === "sell"
                  ? "bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.3)]"
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              }`}
            >
              SELL / SHORT
              <p className="text-[10px] font-normal mt-0.5">PRICE: {price}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Control Panel ─── */
const ControlPanelView = ({ order }: { order: Order }) => {
  const balance =
    order.amount >= 199 ? 100000 : order.amount >= 99 ? 25000 : order.amount >= 49 ? 5000 : 799;
  const realized = 1922.62;
  const assets = balance + realized;
  const targetProfit = balance * 0.08;
  const maxLoss = balance * 0.05;
  const tradingDaysTotal = 5;
  const tradingDaysDone = 4;
  const [chartPeriod, setChartPeriod] = useState<"7D" | "1M" | "ALL">("7D");

  const criteriaRows = [
    { label: "Account Type", stage1: "Standard Pro", stage2: "Institutional", stage3: "Hedge Master" },
    { label: "Starting Balance", stage1: `${(balance / 1000).toFixed(0)},000 USDT`, stage2: "250,000 USDT", stage3: "1,000,000 USDT" },
    { label: "Leverage", stage1: "1:100", stage2: "1:100", stage3: "1:200" },
    { label: "Min Trading Days", stage1: `${tradingDaysDone} / ${tradingDaysTotal} Days`, stage2: "10 Days", stage3: "Unlimited", stage1Progress: (tradingDaysDone / tradingDaysTotal) * 100 },
    { label: "Max Daily Loss", stage1: `0 / ${(maxLoss / 1000).toFixed(0)},000`, stage2: "12,500", stage3: "50,000", stage1Status: "Safe", stage1Progress: 0 },
    { label: "Target Profit", stage1: `${realized.toFixed(2)} / ${targetProfit.toFixed(2)}`, stage2: "20,000", stage3: "Withdrawal", stage1Progress: (realized / targetProfit) * 100 },
  ];

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative rounded-3xl border border-[#163e4a] bg-gradient-to-br from-[#0b2028] to-[#071318] p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-[#00FFA3] blur-3xl" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00FFA3]/15 px-3 py-1 text-xs font-bold text-[#00FFA3] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]" />
              ${assets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <h2 className="text-3xl font-black mb-2">Pro Trading Terminal</h2>
            <p className="text-sm text-[#6e8a94] max-w-sm">
              Your institutional-grade control panel is ready. Access deep liquidity and real-time execution.
            </p>
            <button className="mt-4 flex items-center gap-2 rounded-xl bg-[#00FFA3] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#00e895] transition-all">
              Go to Trading <TrendingUp size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Chart + stats */}
        <div className="rounded-3xl border border-[#163e4a] bg-[#08141c] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Stage 1</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#4a6570]">Account Assets</p>
              <p className="text-3xl font-black">{assets.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-base font-normal text-[#6e8a94]">USDT</span></p>
              <p className="text-sm text-[#00FFA3] mt-1">
                <TrendingUp size={12} className="inline mr-1" />
                +{realized.toFixed(2)} ({((realized / balance) * 100).toFixed(2)}%)
              </p>
            </div>
            <div className="flex gap-1">
              {(["7D", "1M", "ALL"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    chartPeriod === p ? "bg-[#00FFA3] text-black" : "border border-[#163e4a] text-[#6e8a94] hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] rounded-xl overflow-hidden">
            <TradingViewChart symbol="BTCUSDT" />
          </div>
        </div>

        {/* Right stats panel */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#163e4a] bg-[#08141c] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#4a6570]">Gradation Challenge</span>
              <span className="rounded-full bg-[#00FFA3]/15 px-2 py-0.5 text-[10px] font-bold text-[#00FFA3]">ACTIVE</span>
            </div>
            {[
              { label: "Unrealized Profit", value: "--", color: "text-white" },
              { label: "Realized Profit", value: `+${realized.toFixed(2)}`, color: "text-[#00FFA3]" },
              { label: "Assets", value: assets.toFixed(2), color: "text-white" },
              { label: "Balance", value: assets.toFixed(2), color: "text-white" },
            ].map(({ label, value, color }) => (
              <div key={label} className="border-t border-[#163e4a]/40 py-3">
                <p className="text-[10px] uppercase tracking-widest text-[#4a6570] mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
            <div className="border-t border-[#163e4a]/40 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#4a6570]">Equity Health</span>
                <span className="text-xs font-bold text-[#00FFA3]">100.0%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#163e4a]">
                <div className="h-full w-full rounded-full bg-[#00FFA3]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria table */}
      <div className="rounded-3xl border border-[#163e4a] bg-[#08141c] overflow-hidden">
        <div className="grid grid-cols-4 border-b border-[#163e4a]/40">
          {["CRITERIA", "STAGE 1", "STAGE 2", "STAGE 3"].map((h, i) => (
            <div
              key={h}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest ${
                i === 1 ? "bg-[#0e2e36] text-[#00FFA3]" : "text-[#4a6570]"
              }`}
            >
              {h}
            </div>
          ))}
        </div>
        {criteriaRows.map((row) => (
          <div key={row.label} className="grid grid-cols-4 border-b border-[#163e4a]/20 hover:bg-[#0d1e28]/40 transition-colors">
            <div className="px-6 py-4 text-sm text-[#afc0c9]">{row.label}</div>
            <div className="px-6 py-4 bg-[#0e2e36]/30">
              <p className="text-sm font-bold text-white">{row.stage1}</p>
              {row.stage1Progress !== undefined && (
                <div className="mt-2">
                  <div className="h-1 w-full rounded-full bg-[#163e4a]">
                    <div
                      className="h-full rounded-full bg-[#00FFA3] transition-all"
                      style={{ width: `${Math.min(row.stage1Progress, 100)}%` }}
                    />
                  </div>
                  {row.stage1Status && (
                    <p className="text-[10px] text-[#00FFA3] mt-0.5">{row.stage1Status}</p>
                  )}
                  {!row.stage1Status && (
                    <p className="text-[10px] text-[#6e8a94] mt-0.5">{Math.round(row.stage1Progress)}%</p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 text-sm text-[#6e8a94]">{row.stage2}</div>
            <div className="px-6 py-4 text-sm text-[#6e8a94]">{row.stage3}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Accounts Component ─── */
export const Accounts = (): JSX.Element => {
  const { user } = useAuth();
  const [data, setData] = useState<AccountPayload>({ user: null, orders: [] });
  const [activeTab, setActiveTab] = useState<string>("CHALLENGE");
  const [view, setView] = useState<"accounts" | "trade" | "control">("accounts");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    api.accounts(user.id).then(setData).catch(() => setData({ user: null, orders: [] }));
  }, [user]);

  const hasOrders = data.orders.length > 0;

  if (view === "trade" && selectedOrder) {
    return (
      <DashboardLayout>
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setView("accounts")}
            className="flex items-center gap-2 rounded-xl border border-[#163e4a] bg-[#0a1a22] px-3 py-2 text-sm text-[#afc0c9] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-xl font-black">Trading Terminal</h1>
          <span className="rounded-full bg-[#00FFA3]/15 px-3 py-1 text-xs font-bold text-[#00FFA3]">
            LIVE
          </span>
        </div>
        <TradeView order={selectedOrder} />
      </DashboardLayout>
    );
  }

  if (view === "control" && selectedOrder) {
    return (
      <DashboardLayout>
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setView("accounts")}
            className="flex items-center gap-2 rounded-xl border border-[#163e4a] bg-[#0a1a22] px-3 py-2 text-sm text-[#afc0c9] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-xl font-black">Control Panel</h1>
        </div>
        <ControlPanelView order={selectedOrder} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Tabs */}
      <div className="mb-8 flex items-center rounded-2xl border border-[#163e4a] bg-[#0a1a22] p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "bg-[#00FFA3] text-black shadow-[0_0_12px_rgba(0,255,163,0.2)]"
                : "text-[#6e8a94] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {hasOrders ? (
        <div className="space-y-6">
          {data.orders.map((order) => {
            const accountId = `20005${String(order.id).padStart(4, "0")}`;
            const tierName = order.challenge_name.toUpperCase();
            const balance =
              order.amount >= 199 ? 100000 : order.amount >= 99 ? 25000 : order.amount >= 49 ? 5000 : 799;

            return (
              <div key={order.id}>
                {/* Identity header */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FFA3]">
                    Trading Identity
                  </p>
                  <h2 className="text-4xl font-black tracking-tight">ID: {accountId}</h2>
                  <p className="text-sm text-[#6e8a94]">
                    Institutional Prop Account • Multi-Asset Environment
                  </p>
                </div>

                {/* Card */}
                <div className="flex flex-col gap-0 rounded-3xl border border-[#163e4a] bg-gradient-to-br from-[#0b2028] to-[#071318] lg:flex-row lg:items-stretch">
                  {/* Left - Tier badge */}
                  <div className="flex min-w-[240px] flex-col justify-center rounded-l-3xl bg-gradient-to-br from-[#0e2e36] to-[#081a20] p-6 lg:rounded-r-none">
                    <span className="mb-4 w-fit rounded-md bg-[#00FFA3]/15 px-3 py-1 text-sm font-black tracking-wider text-[#00FFA3]">
                      {tierName}
                    </span>
                    <p className="text-[10px] uppercase tracking-widest text-[#4a6570]">
                      Master Equity
                    </p>
                    <p className="mt-1 font-mono text-lg tracking-[0.35em] text-[#6e8a94]">
                      •••• •••• ••••
                    </p>
                    <p className="mt-4 text-3xl font-black">{order.id + 5312}</p>
                  </div>

                  {/* Middle - Details */}
                  <div className="flex flex-1 flex-col justify-center gap-5 border-l border-r border-[#163e4a]/50 p-6">
                    <div>
                      <h3 className="text-xl font-bold">Stage 1</h3>
                      <p className="flex items-center gap-1.5 text-xs text-[#00FFA3]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3]" />
                        STATUS:CHALLENGE
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#4a6570]">
                          Start Balance
                        </p>
                        <p className="text-base font-bold">{balance.toLocaleString()}.00 USDT</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#4a6570]">
                          End of Period
                        </p>
                        <p className="text-base font-bold">Unlimited</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#4a6570]">
                        Risk Limit (24 Hours)
                      </p>
                      <p className="text-base font-bold">
                        {(balance * 0.05).toLocaleString()}.00 USDT
                      </p>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex min-w-[180px] flex-col items-center justify-center gap-3 p-6">
                    <button
                      onClick={() => { setSelectedOrder(order); setView("trade"); }}
                      className="w-full rounded-xl bg-[#00FFA3] py-3 text-sm font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_16px_rgba(0,255,163,0.2)]"
                    >
                      Trade
                    </button>
                    <button
                      onClick={() => { setSelectedOrder(order); setView("control"); }}
                      className="w-full rounded-xl border border-[#2a4e58] bg-[#0b1f28] py-3 text-sm font-medium text-[#afc0c9] transition-colors hover:border-[#00FFA3]/40 hover:text-white"
                    >
                      Control Panel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty state ── */
        <section className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-[100px] w-[160px] items-end justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#0e3d43]/80 to-[#082a30]/60 p-4 shadow-[0_8px_32px_rgba(0,255,163,0.06)]">
            <div className="h-[36px] w-[12px] rounded-sm bg-[#00ffa3]/70" />
            <div className="h-[52px] w-[12px] rounded-sm bg-[#00ffa3]" />
            <div className="h-[30px] w-[12px] rounded-sm bg-[#ff4d4d]/80" />
            <div className="h-[42px] w-[12px] rounded-sm bg-[#ff4d4d]" />
            <div className="h-[48px] w-[12px] rounded-sm bg-[#00ffa3]" />
            <div className="h-[22px] w-[12px] rounded-sm bg-[#00ffa3]/60" />
          </div>
          <h2 className="text-3xl font-bold">
            Sorry, this page is available
            <br />
            only to traders.
          </h2>
          <p className="mt-4 max-w-md text-[#6e8188]">
            Traders are individuals who have successfully completed the Evaluation Process and manage a Hash Hedge trading account.
          </p>
          <Link
            to="/challenge"
            className="mt-8 rounded-xl bg-[#00FFA3] px-8 py-3 text-base font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
          >
            New challenge
          </Link>
        </section>
      )}
    </DashboardLayout>
  );
};
