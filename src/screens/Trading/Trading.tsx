import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { HeaderUserControls } from "../../components/HeaderUserControls";
import { Sidebar } from "../../components/Sidebar";
import { useAuth } from "../../lib/auth";
import { api, type TradingPerformancePoint, type TradingPerformanceResponse } from "../../lib/api";
import { useTranslation } from "../../lib/i18n";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

type TimeRange = "7D" | "1M" | "ALL";

const criteriaRows = [
  {
    labelKey: "trading.criteria_account_type",
    stage1: { text: "Standard Pro", highlight: true },
    stage2: { text: "Institutional" },
    stage3: { text: "Hedge Master" },
  },
  {
    labelKey: "trading.criteria_starting_balance",
    stage1: { text: "100,000 USDT", highlight: true },
    stage2: { text: "250,000 USDT" },
    stage3: { text: "1,000,000 USDT" },
  },
  {
    labelKey: "trading.criteria_leverage",
    stage1: { text: "1:100", highlight: true },
    stage2: { text: "1:100" },
    stage3: { text: "1:200" },
  },
  {
    labelKey: "trading.criteria_min_trading_days",
    stage1: { text: "4 / 5 Days", highlight: true, progress: 90, progressLabel: "90%" },
    stage2: { text: "10 Days" },
    stage3: { text: "Unlimited" },
  },
  {
    labelKey: "trading.criteria_max_daily_loss",
    stage1: { text: "0 / 5,000", highlight: true, progress: 3, progressLabel: "Safe", safe: true },
    stage2: { text: "12,500" },
    stage3: { text: "50,000" },
  },
  {
    labelKey: "trading.criteria_target_profit",
    stage1: { text: "1,922.62 / 8,000", highlight: true, progress: 24, progressLabel: "24%" },
    stage2: { text: "20,000" },
    stage3: { text: "Withdrawal" },
  },
];

const mobileNavTabs = [
  { labelKey: "nav.new_challenge", route: "/challenge" },
  { labelKey: "nav.accounts", route: "/accounts" },
  { labelKey: "nav.payments", route: "/payments" },
  { labelKey: "nav.withdrawals", route: "/withdrawals" },
];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const createEmptyPerformance = (): TradingPerformanceResponse => {
  const now = Date.now();
  return {
    currentBalance: 0,
    changeAmount: 0,
    changePercent: 0,
    realizedProfit: 0,
    totalCredits: 0,
    totalFees: 0,
    startingBalance: 0,
    equityHealth: 100,
    series: [
      { ts: now - 1, balance: 0 },
      { ts: now, balance: 0 },
    ],
  };
};

const formatMoney = (value: number) => moneyFormatter.format(Number.isFinite(value) ? value : 0);

const formatSignedMoney = (value: number) => `${value >= 0 ? "+" : "-"}${formatMoney(Math.abs(value))}`;

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;

const getPeriodChangeLabelKey = (range: TimeRange) => {
  if (range === "1M") return "trading.month_change";
  if (range === "ALL") return "trading.alltime_change";
  return "trading.week_change";
};

const buildSmoothPath = (points: Array<{ x: number; y: number }>) => {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
};

const pickLabelIndexes = (pointCount: number, desiredCount: number) => {
  if (pointCount <= desiredCount) {
    return Array.from({ length: pointCount }, (_, index) => index);
  }

  const indexes = new Set<number>([0, pointCount - 1]);
  for (let step = 1; indexes.size < desiredCount; step += 1) {
    indexes.add(Math.round((step * (pointCount - 1)) / (desiredCount - 1)));
  }

  return Array.from(indexes).sort((left, right) => left - right);
};

const formatAxisLabel = (timestamp: number, range: TimeRange) => {
  if (range === "7D") {
    return new Date(timestamp)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
  }

  return new Date(timestamp)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .replace(",", "")
    .toUpperCase();
};

function NeedAssistance() {
  const { t } = useTranslation();
  return (
  <div className="mt-5 rounded-xl md:rounded-2xl border border-[#163e4a]/40 bg-[#08141c]/60 p-3 min-[375px]:p-4 md:p-6">
    <p className="mb-2 min-[375px]:mb-3 md:mb-4 text-[10px] min-[375px]:text-xs md:text-sm text-gray-400">{t("sidebar.need_assistance")}</p>
    <div>
      <button className="w-full h-9 min-[375px]:h-10 md:h-14 rounded-xl md:rounded-2xl bg-[#00FFA3] text-[10px] min-[375px]:text-xs md:text-base font-bold text-black transition-colors hover:bg-[#00e693]">{t("sidebar.contact_support")}</button>
    </div>
  </div>
);
}

const PerformanceChart = ({
  points,
  range,
  loading,
  error,
  startingBalance,
}: {
  points: TradingPerformancePoint[];
  range: TimeRange;
  loading: boolean;
  error: string | null;
  startingBalance?: number;
}) => {
  const { t } = useTranslation();
  const chartId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const safePoints = useMemo(() => {
    if (points.length >= 2) {
      return points;
    }

    const fallback = createEmptyPerformance().series;
    return points.length === 1 ? [points[0], { ts: points[0].ts + 1, balance: points[0].balance }] : fallback;
  }, [points]);

  const geometry = useMemo(() => {
    const width = 1000;
    const height = 340;
    const padding = { top: 24, right: 18, bottom: 50, left: 18 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const timestamps = safePoints.map((point) => point.ts);
    const balances = safePoints.map((point) => point.balance);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    const minBalance = Math.min(...balances);
    const maxBalance = Math.max(...balances);
    const balancePad = Math.max(10, (maxBalance - minBalance) * 0.16 || maxBalance * 0.05 || 10);
    const chartMin = minBalance - balancePad;
    const chartMax = maxBalance + balancePad;
    const tsSpan = Math.max(1, maxTs - minTs);
    const balanceSpan = Math.max(1, chartMax - chartMin);

    const normalizedPoints = safePoints.map((point) => ({
      ...point,
      x: padding.left + ((point.ts - minTs) / tsSpan) * innerWidth,
      y: padding.top + ((chartMax - point.balance) / balanceSpan) * innerHeight,
    }));

    const linePath = buildSmoothPath(normalizedPoints);
    const baselineY = height - padding.bottom;
    const fillPath = normalizedPoints.length
      ? `${linePath} L ${normalizedPoints[normalizedPoints.length - 1].x} ${baselineY} L ${normalizedPoints[0].x} ${baselineY} Z`
      : "";

    const labelIndexes = pickLabelIndexes(
      normalizedPoints.length,
      range === "7D" ? Math.min(7, normalizedPoints.length) : Math.min(5, normalizedPoints.length),
    );

    return {
      width,
      height,
      padding,
      normalizedPoints,
      linePath,
      fillPath,
      labelIndexes,
      gridLines: [0.15, 0.5, 0.85].map((ratio) => padding.top + innerHeight * ratio),
    };
  }, [range, safePoints]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || !geometry.normalizedPoints.length) return;
      const rect = container.getBoundingClientRect();
      const scaleX = geometry.width / rect.width;
      const svgX = (e.clientX - rect.left) * scaleX;

      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < geometry.normalizedPoints.length; i++) {
        const dist = Math.abs(geometry.normalizedPoints[i].x - svgX);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }
      setHoverIndex(closest);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [geometry],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  const hoveredPoint = hoverIndex !== null ? safePoints[hoverIndex] : null;
  const hoveredNorm = hoverIndex !== null ? geometry.normalizedPoints[hoverIndex] : null;
  const refBalance = startingBalance ?? safePoints[0]?.balance ?? 0;
  const hoverChange = hoveredPoint ? hoveredPoint.balance - refBalance : 0;
  const hoverChangePct = refBalance !== 0 && hoveredPoint ? ((hoveredPoint.balance - refBalance) / refBalance) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="block h-full w-full">
        <defs>
          <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#00FFA3" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${chartId}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00cc84" />
            <stop offset="50%" stopColor="#00FFA3" />
            <stop offset="100%" stopColor="#8dffd8" />
          </linearGradient>
          <filter id={`${chartId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          width={geometry.width}
          height={geometry.height}
          rx="26"
          fill="#0b0f14"
        />

        {geometry.gridLines.map((lineY) => (
          <line
            key={lineY}
            x1={geometry.padding.left}
            y1={lineY}
            x2={geometry.width - geometry.padding.right}
            y2={lineY}
            stroke="#14202a"
            strokeWidth="1"
          />
        ))}

        {geometry.fillPath ? <path d={geometry.fillPath} fill={`url(#${chartId}-fill)`} opacity="0.95" /> : null}
        {geometry.linePath ? (
          <>
            <path
              d={geometry.linePath}
              fill="none"
              stroke={`url(#${chartId}-stroke)`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
              filter={`url(#${chartId}-glow)`}
            />
            <path
              d={geometry.linePath}
              fill="none"
              stroke={`url(#${chartId}-stroke)`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : null}

        {/* Hover vertical line & dot */}
        {hoveredNorm && (
          <>
            <line
              x1={hoveredNorm.x}
              y1={geometry.padding.top}
              x2={hoveredNorm.x}
              y2={geometry.height - geometry.padding.bottom}
              stroke="#00FFA3"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            <circle cx={hoveredNorm.x} cy={hoveredNorm.y} r="8" fill="#00FFA3" fillOpacity="0.2" />
            <circle cx={hoveredNorm.x} cy={hoveredNorm.y} r="4" fill="#00FFA3" />
          </>
        )}

        {/* Last-point dot (hide when hovering) */}
        {geometry.normalizedPoints.length && hoverIndex === null ? (
          <g>
            <circle
              cx={geometry.normalizedPoints[geometry.normalizedPoints.length - 1].x}
              cy={geometry.normalizedPoints[geometry.normalizedPoints.length - 1].y}
              r="7"
              fill="#00FFA3"
              fillOpacity="0.18"
            />
            <circle
              cx={geometry.normalizedPoints[geometry.normalizedPoints.length - 1].x}
              cy={geometry.normalizedPoints[geometry.normalizedPoints.length - 1].y}
              r="3.5"
              fill="#b6ffe4"
            />
          </g>
        ) : null}

        {geometry.labelIndexes.map((index) => {
          const point = safePoints[index];
          const normalized = geometry.normalizedPoints[index];

          return (
            <text
              key={`${point.ts}-${index}`}
              x={normalized.x}
              y={geometry.height - 14}
              fill="#5b6773"
              fontSize="12"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              {formatAxisLabel(point.ts, range)}
            </text>
          );
        })}
      </svg>

      {/* Hover tooltip card */}
      {hoveredPoint && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: Math.min(tooltipPos.x + 14, (containerRef.current?.clientWidth ?? 999) - 180),
            top: Math.max(tooltipPos.y - 90, 4),
          }}
        >
          <div className="rounded-xl border border-[#00FFA3]/20 bg-[#0b1016]/95 px-3 py-2.5 shadow-lg shadow-black/40 backdrop-blur-md min-w-[155px]">
            <p className="text-[10px] text-gray-400 mb-1">
              {new Date(hoveredPoint.ts).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              {new Date(hoveredPoint.ts).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm font-bold text-white">
              {formatMoney(hoveredPoint.balance)}{" "}
              <span className="text-[10px] font-medium text-[#00ffa3]">USDT</span>
            </p>
            <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
              hoverChange >= 0 ? "text-[#00ffa3]" : "text-[#ff6b6b]"
            }`}>
              {hoverChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span>{formatSignedMoney(hoverChange)} ({formatSignedPercent(hoverChangePct)})</span>
            </div>
          </div>
        </div>
      )}

      {(loading || error) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-[#05070a]/35 backdrop-blur-[1px]">
          <div className="rounded-2xl border border-white/10 bg-[#0b1016]/85 px-4 py-2 text-center">
            <p className="text-sm font-semibold text-white">{loading ? t("trading.loading_performance") : t("trading.db_sync_issue")}</p>
            <p className="mt-1 text-xs text-gray-400">{loading ? t("trading.fetching_history") : error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════ Random Performance Chart ═══════════════════════ */
const RANDOM_CHART_SEED = (() => {
  const pts: { x: number; y: number }[] = [];
  let balance = 40000 + Math.random() * 5000;
  for (let i = 0; i <= 30; i++) {
    const x = (i / 30) * 960 + 20;
    balance += (Math.random() - 0.42) * 800;
    balance = Math.max(35000, Math.min(50000, balance));
    const y = 24 + ((50000 - balance) / 18000) * 260;
    pts.push({ x, y });
  }
  return pts;
})();

const RandomPerformanceChart = () => {
  const id = useId().replace(/:/g, "");
  const pts = RANDOM_CHART_SEED;
  const linePath = buildSmoothPath(pts);
  const last = pts[pts.length - 1];
  const fillPath = `${linePath} L ${last.x} 310 L ${pts[0].x} 310 Z`;
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="relative h-full w-full bg-[#05070A]">
      <svg viewBox="0 0 1000 340" className="block h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#00FFA3" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00cc84" />
            <stop offset="50%" stopColor="#00FFA3" />
            <stop offset="100%" stopColor="#8dffd8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="340" fill="#05070A" />
        {[0.2, 0.5, 0.8].map(r => (
          <line key={r} x1="20" y1={24 + 260 * r} x2="980" y2={24 + 260 * r} stroke="#14202a" strokeWidth="1" />
        ))}
        <path d={fillPath} fill={`url(#${id}-fill)`} opacity="0.95" />
        <path d={linePath} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="7" fill="#00FFA3" fillOpacity="0.18" />
        <circle cx={last.x} cy={last.y} r="3.5" fill="#b6ffe4" />
        {days.map((d, i) => (
          <text key={d} x={20 + (i / 6) * 960} y="326" fill="#5b6773" fontSize="12" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="0.08em">{d}</text>
        ))}
      </svg>
    </div>
  );
};

export const Trading = (): JSX.Element => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("7D");
  const [performanceData, setPerformanceData] = useState<TradingPerformanceResponse | null>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [performanceError, setPerformanceError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user?.id == null) {
      setPerformanceData(null);
      setLoadingPerformance(false);
      setPerformanceError(null);
      return;
    }

    let cancelled = false;
    setLoadingPerformance(true);
    setPerformanceError(null);

    api.tradingPerformance(user.id, timeRange)
      .then((response) => {
        if (cancelled) return;
        setPerformanceData(response);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPerformanceError(error instanceof Error ? error.message : "Failed to load performance.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingPerformance(false);
      });

    return () => {
      cancelled = true;
    };
  }, [timeRange, user?.id]);

  const performance = performanceData ?? createEmptyPerformance();
  const currentBalance = performance.currentBalance;
  const changeAmount = performance.changeAmount;
  const changePercent = performance.changePercent;
  const realizedProfit = performance.realizedProfit;
  const equityHealth = Math.max(0, Math.min(100, performance.equityHealth));
  const chartPoints = performance.series.length ? performance.series : createEmptyPerformance().series;
  const realizedPositive = realizedProfit > 0;
  const realizedNegative = realizedProfit < 0;
  const ChangeIcon = changeAmount >= 0 ? ArrowUpRight : ArrowDownRight;
  const RealizedIcon = realizedProfit >= 0 ? ArrowUpRight : ArrowDownRight;

  const summaryTextColor = changeAmount > 0 ? "text-[#00ffa3]" : changeAmount < 0 ? "text-[#ff6b6b]" : "text-white";
  const realizedTextColor = realizedPositive ? "text-[#00ffa3]" : realizedNegative ? "text-[#ff6b6b]" : "text-white";
  const badgeText = `$${formatMoney(currentBalance)}`;
  const changeSummary = `${formatSignedMoney(changeAmount)} (${formatSignedPercent(changePercent)})`;
  const performanceLegendText = loadingPerformance
    ? t("trading.syncing_data")
    : performanceError
      ? t("trading.showing_last")
      : t("trading.balance_history_desc");

  const isMobileTabActive = (route: string) => {
    if (route === "/accounts") return true;
    return location.pathname.startsWith(route);
  };

  return (
    <>
      {/* ═══ MOBILE LAYOUT (< xl) ═══ */}
      <div className="xl:hidden w-full overflow-x-clip flex flex-col min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">
        <header className="sticky top-0 z-50 flex h-14 md:h-16 lg:h-20 items-center justify-between bg-[#05070A]/95 px-3 backdrop-blur-md min-[375px]:px-4 md:px-6 lg:px-10">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="UPDOWNX" className="h-6 w-auto object-contain min-[375px]:h-7 md:h-9 lg:h-12" />
          </Link>
          <div className="flex items-center gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-6">
            <LanguageSwitcher size="sm" />
            <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px] md:px-5 md:py-2 md:text-sm lg:px-8 lg:py-3 lg:text-lg md:rounded-xl">
              {t("trading.start")}
            </Link>
            <button onClick={() => setSidebarOpen((previous) => !previous)} className="text-gray-300 hover:text-white md:p-1 lg:p-2" aria-label="Toggle menu">
              {sidebarOpen ? <X className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" /> : <Menu className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" />}
            </button>
          </div>
        </header>

        {sidebarOpen && (
          <nav className="flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full">
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
                    {t(tab.labelKey)}
                    <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 md:bottom-2 md:left-3 md:right-3 md:h-0.5 lg:bottom-3 lg:left-5 lg:right-5 ${isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        <div className="flex-1 flex flex-col relative w-full overflow-x-clip">
          <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
          <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />
          <div className="relative z-10 px-3 py-4 min-[375px]:px-4 md:px-8 md:py-6 flex flex-col gap-4 min-[375px]:gap-5 md:gap-6">
            <div className="relative overflow-hidden rounded-xl min-[375px]:rounded-2xl bg-gradient-to-br from-[#0a1a14] to-[#0b0f14] border border-[#00ffa3]/10 p-4 min-[375px]:p-5 md:p-8">
              <div className="absolute inset-0 bg-[url('https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png')] bg-cover bg-center opacity-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-[#05070a]/80 rounded-full px-2.5 py-1 mb-3 md:mb-4 border border-[#00ffa3]/20 md:px-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                  <span className="text-[#00ffa3] text-[10px] min-[375px]:text-xs md:text-sm font-semibold">{badgeText}</span>
                </div>
                <h1 className="font-bold text-white text-lg min-[375px]:text-xl md:text-3xl tracking-tight mb-1.5 md:mb-2">
                  {t("trading.pro_terminal")}
                </h1>
                <p className="text-gray-400 text-[11px] min-[375px]:text-xs md:text-base leading-relaxed mb-4 md:mb-5">
                  {t("trading.pro_terminal_desc")}
                </p>
                <Link
                  to="/trading"
                  className="inline-flex items-center gap-1.5 bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-semibold text-[11px] min-[375px]:text-xs md:text-base px-4 py-2 min-[375px]:px-5 min-[375px]:py-2.5 md:px-6 md:py-3 rounded-xl transition-colors no-underline"
                >
                  {t("trading.go_to_trading")}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-[375px]:gap-4 md:gap-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-white text-base min-[375px]:text-lg md:text-2xl">{t("trading.stage_1")}</h2>
                  <p className="mt-1 text-[10px] min-[375px]:text-xs text-gray-500">{t("trading.live_performance")}</p>
                </div>
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

              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 md:gap-x-8">
                <div>
                  <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase block">{t("trading.account_assets")}</span>
                  <span className="font-bold text-white text-lg min-[375px]:text-xl md:text-2xl tracking-tight">{formatMoney(currentBalance)}</span>
                  <span className="font-medium text-[#00ffa3] text-[10px] min-[375px]:text-xs md:text-sm ml-1">USDT</span>
                </div>
                <div>
                  <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase block">{t(getPeriodChangeLabelKey(timeRange))}</span>
                  <div className={`inline-flex items-center gap-1 font-semibold text-sm min-[375px]:text-base md:text-lg ${summaryTextColor}`}>
                    <ChangeIcon size={14} />
                    <span>{changeSummary}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 min-[375px]:gap-3">
                <div className="flex items-center gap-1.5 rounded-full border border-[#113428] bg-[#081610]/90 px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00ffa3]" />
                  <span className="text-[8px] min-[375px]:text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00ffa3]">{t("trading.live_balance")}</span>
                </div>
                <span className="text-[9px] min-[375px]:text-[10px] md:text-xs text-gray-500">{performanceLegendText}</span>
              </div>

              <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 relative h-[220px] min-[375px]:h-[260px] md:h-[340px] overflow-hidden">
                <div className="absolute inset-2 min-[375px]:inset-3 md:inset-4">
                  <PerformanceChart
                    points={chartPoints}
                    range={timeRange}
                    loading={loadingPerformance}
                    error={performanceError}
                    startingBalance={performance.startingBalance}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 p-3 min-[375px]:p-4 md:p-6 flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[8px] min-[375px]:text-[9px] md:text-[11px] text-gray-400 tracking-[1.5px] uppercase">{t("trading.gradation_challenge")}</span>
                <span className="bg-[#00ffa3]/15 text-[#00ffa3] text-[8px] min-[375px]:text-[9px] md:text-[11px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-md tracking-wider uppercase">{t("trading.active")}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 min-[375px]:gap-2.5 md:gap-4">
                <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">{t("trading.unrealized_profit")}</span>
                  <span className="font-semibold text-white text-sm min-[375px]:text-base md:text-xl">--</span>
                </div>
                <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">{t("trading.assets")}</span>
                  <span className="font-bold text-white text-sm min-[375px]:text-base md:text-xl">{formatMoney(currentBalance)}</span>
                </div>
                <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">{t("trading.realized_profit")}</span>
                  <div className={`flex items-center gap-1 ${realizedTextColor}`}>
                    <span className="font-semibold text-sm min-[375px]:text-base md:text-xl">{formatSignedMoney(realizedProfit)}</span>
                    {realizedProfit !== 0 ? <RealizedIcon size={12} /> : null}
                  </div>
                </div>
                <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                  <span className="text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-wider uppercase block mb-1 md:mb-2">{t("trading.balance")}</span>
                  <span className="font-bold text-white text-sm min-[375px]:text-base md:text-xl">{formatMoney(currentBalance)}</span>
                </div>
              </div>

              <div className="bg-[#080c10] rounded-lg min-[375px]:rounded-xl md:rounded-2xl p-2.5 min-[375px]:p-3 md:p-5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] min-[375px]:text-[10px] md:text-xs text-gray-400">{t("trading.equity_health")}</span>
                  <span className="font-bold text-[#00ffa3] text-[10px] min-[375px]:text-[11px] md:text-sm">{equityHealth.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-[#1a2030] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ffa3] rounded-full transition-[width] duration-500" style={{ width: `${equityHealth}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f14] rounded-xl min-[375px]:rounded-2xl border border-white/5 overflow-hidden">
              <div>
                <div className="w-full">
                  <div className="grid grid-cols-4 border-b border-white/5">
                    <div className="p-2.5 min-[375px]:p-3 md:p-4">
                      <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.criteria")}</span>
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                      <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-[#00ffa3] tracking-[1.5px] uppercase">{t("trading.stage_1")}</span>
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4">
                      <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.stage_2")}</span>
                    </div>
                    <div className="p-2.5 min-[375px]:p-3 md:p-4">
                      <span className="font-bold text-[7px] min-[375px]:text-[8px] md:text-[10px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.stage_3")}</span>
                    </div>
                  </div>
                  {criteriaRows.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-4 ${idx < criteriaRows.length - 1 ? "border-b border-white/5" : ""}`}>
                      <div className="p-2.5 min-[375px]:p-3 md:p-4 flex items-center">
                        <span className="text-[10px] min-[375px]:text-[11px] md:text-sm text-gray-300">{t(row.labelKey)}</span>
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
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            className="absolute top-[62px] left-0 w-full h-full object-cover opacity-60"
            alt="Background"
            src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png"
          />
        </div>

        <header data-top-menu className="sticky top-0 z-50 flex h-16 2xl:h-20 items-center justify-between border-b border-[#2cf6c3] bg-[#05070A]/95 px-4 sm:px-6 2xl:px-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-300 hover:text-white p-1"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="UPDOWNX" className="h-8 2xl:h-10 w-auto object-contain" />
            </Link>
          </div>

          <HeaderUserControls />
        </header>

        <div className="flex flex-1 relative z-10">
          <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 flex flex-col gap-6 p-6 sm:p-10 min-w-0 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1a14] to-[#0b0f14] border border-[#00ffa3]/10 p-6 sm:p-8">
              <div className="absolute inset-0 bg-[url('https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png')] bg-cover bg-center opacity-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#05070a]/80 rounded-full px-3 py-1 mb-4 border border-[#00ffa3]/20">
                  <div className="w-2 h-2 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                  <span className="text-[#00ffa3] text-xs font-semibold font-inter">{badgeText}</span>
                </div>
                <h1 className="font-inter font-bold text-white text-2xl sm:text-3xl tracking-tight mb-2">
                  {t("trading.pro_terminal")}
                </h1>
                <p className="font-inter text-gray-400 text-sm leading-relaxed max-w-md mb-5">
                  {t("trading.pro_terminal_desc")}
                </p>
                <Link
                  to="/trading"
                  className="inline-flex items-center gap-2 bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] font-inter font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors no-underline"
                >
                  {t("trading.go_to_trading")}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="font-inter font-bold text-white text-xl mb-1">{t("trading.stage_1")}</h2>
                    <p className="mb-3 text-sm text-gray-500">{t("trading.live_performance")}</p>
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                      <div>
                        <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase block">{t("trading.account_assets")}</span>
                        <span className="font-inter font-bold text-white text-2xl tracking-tight">{formatMoney(currentBalance)}</span>
                        <span className="font-inter font-medium text-[#00ffa3] text-sm ml-2">USDT</span>
                      </div>
                      <div>
                        <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase block">{t(getPeriodChangeLabelKey(timeRange))}</span>
                        <div className={`inline-flex items-center gap-1.5 font-inter font-semibold text-lg ${summaryTextColor}`}>
                          <ChangeIcon size={16} />
                          <span>{changeSummary}</span>
                        </div>
                      </div>
                    </div>
                  </div>

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

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-full border border-[#113428] bg-[#081610]/90 px-3 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00ffa3]" />
                    <span className="font-inter text-[10px] text-[#00ffa3] font-semibold tracking-wider uppercase">{t("trading.live_balance")}</span>
                  </div>
                  <span className="font-inter text-xs text-gray-500">{performanceLegendText}</span>
                </div>

                <div className="bg-[#0b0f14] rounded-2xl border border-white/5 flex-1 relative min-h-[360px] overflow-hidden">
                  <div className="absolute inset-4">
                    <PerformanceChart
                      points={chartPoints}
                      range={timeRange}
                      loading={loadingPerformance}
                      error={performanceError}
                      startingBalance={performance.startingBalance}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[220px] shrink-0">
                <div className="bg-[#0b0f14] rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-inter font-bold text-[9px] text-gray-400 tracking-[1.5px] uppercase">{t("trading.gradation_challenge")}</span>
                    <span className="bg-[#00ffa3]/15 text-[#00ffa3] text-[9px] font-bold font-inter px-2 py-0.5 rounded-md tracking-wider uppercase">{t("trading.active")}</span>
                  </div>

                  <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                    <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">{t("trading.unrealized_profit")}</span>
                    <span className="font-inter font-semibold text-white text-lg">--</span>
                  </div>

                  <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                    <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">{t("trading.realized_profit")}</span>
                    <div className={`flex items-center gap-1.5 ${realizedTextColor}`}>
                      <span className="font-inter font-semibold text-lg">{formatSignedMoney(realizedProfit)}</span>
                      {realizedProfit !== 0 ? <RealizedIcon size={14} /> : null}
                    </div>
                  </div>

                  <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                    <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">{t("trading.assets")}</span>
                    <span className="font-inter font-bold text-white text-base">{formatMoney(currentBalance)}</span>
                  </div>

                  <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                    <span className="font-inter text-[9px] text-gray-500 tracking-wider uppercase block mb-1">{t("trading.balance")}</span>
                    <span className="font-inter font-bold text-white text-base">{formatMoney(currentBalance)}</span>
                  </div>

                  <div className="bg-[#080c10] rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-inter text-[10px] text-gray-400">{t("trading.equity_health")}</span>
                      <span className="font-inter font-bold text-[#00ffa3] text-[11px]">{equityHealth.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00ffa3] rounded-full transition-[width] duration-500" style={{ width: `${equityHealth}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f14] rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-4 border-b border-white/5">
                <div className="p-4">
                  <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.criteria")}</span>
                </div>
                <div className="p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                  <span className="font-inter font-bold text-[9px] text-[#00ffa3] tracking-[1.5px] uppercase">{t("trading.stage_1")}</span>
                </div>
                <div className="p-4">
                  <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.stage_2")}</span>
                </div>
                <div className="p-4">
                  <span className="font-inter font-bold text-[9px] text-gray-500 tracking-[1.5px] uppercase">{t("trading.stage_3")}</span>
                </div>
              </div>

              {criteriaRows.map((row, idx) => (
                <div key={idx} className={`grid grid-cols-4 ${idx < criteriaRows.length - 1 ? "border-b border-white/5" : ""}`}>
                  <div className="p-4 flex items-center">
                    <span className="font-inter text-sm text-gray-300">{t(row.labelKey)}</span>
                  </div>
                  <div className="p-4 bg-[#00ffa3]/5 border-l border-r border-[#00ffa3]/10">
                    <span className="font-inter font-semibold text-sm text-white">{row.stage1.text}</span>
                    {row.stage1.progress !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-[#00ffa3]" style={{ width: `${row.stage1.progress}%` }} />
                        </div>
                        <span className="font-inter text-[10px] font-semibold text-[#00ffa3]">{row.stage1.progressLabel}</span>
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
    </>
  );
};
