import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api, type Challenge } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ChevronDown, ShieldCheck, Menu } from "lucide-react";

/* ── Shared nav tabs for the mobile header ── */
const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];

/* ── BTC icon SVG (reused in both mobile and desktop) ── */
const BtcIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 17 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.75 22.5V20H0V17.5H2.5V5H0V2.5H3.75V0H6.25V2.5H8.75V0H11.25V2.65625C12.3333 2.94792 13.2292 3.53646 13.9375 4.42188C14.6458 5.30729 15 6.33333 15 7.5C15 8.10417 14.8958 8.68229 14.6875 9.23438C14.4792 9.78646 14.1875 10.2812 13.8125 10.7188C14.5417 11.1562 15.1302 11.75 15.5781 12.5C16.026 13.25 16.25 14.0833 16.25 15C16.25 16.375 15.7604 17.5521 14.7812 18.5312C13.8021 19.5104 12.625 20 11.25 20V22.5H8.75V20H6.25V22.5H3.75ZM5 10H10C10.6875 10 11.276 9.75521 11.7656 9.26562C12.2552 8.77604 12.5 8.1875 12.5 7.5C12.5 6.8125 12.2552 6.22396 11.7656 5.73438C11.276 5.24479 10.6875 5 10 5H5V10ZM5 17.5H11.25C11.9375 17.5 12.526 17.2552 13.0156 16.7656C13.5052 16.276 13.75 15.6875 13.75 15C13.75 14.3125 13.5052 13.724 13.0156 13.2344C12.526 12.7448 11.9375 12.5 11.25 12.5H5V17.5Z" fill="#00FFA3" />
  </svg>
);

/* ── Need Assistance footer (mobile) ── */
const NeedAssistance = () => (
  <div className="mt-4 md:mt-6 rounded-xl border border-[#163e4a]/40 bg-[#08141c]/60 p-4 md:p-6">
    <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-400">Need assistance?</p>
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <button className="h-10 md:h-14 rounded-xl bg-[#00FFA3] text-xs md:text-sm font-bold text-black">Contact Support</button>
      <button className="h-10 md:h-14 rounded-xl border border-[#163e4a] bg-[#0b1820] text-xs md:text-sm font-bold text-white">Help</button>
    </div>
  </div>
);

export const Checkout = (): JSX.Element => {
  const { planId = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<Challenge[]>([]);
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(false);
  const [mobileStep, setMobileStep] = useState<1 | 2>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("Loading challenges...");
    api.challenges()
      .then((data) => {
        console.log("Challenges loaded:", data);
        setPlans(data);
      })
      .catch((error) => {
        console.error("Failed to load challenges:", error);
        setPlans([]);
      });
  }, []);

  const plan = useMemo(() => {
    const found = plans.find((item) => item.id === planId);
    console.log("Plan lookup:", { planId, plans, found });
    return found;
  }, [plans, planId]);

  const handleOrder = async () => {
    console.log("handleOrder called", { plan, user, loading });
    if (!plan || !user) {
      console.error("Missing plan or user", { plan, user });
      alert(`Cannot create order: ${!plan ? "Plan not found" : "User not logged in"}`);
      return;
    }
    setLoading(true);
    try {
      const order = await api.createOrder({
        userId: user.id,
        challengeId: plan.id,
        country,
        city,
        paymentMethod: "crypto",
      });
      console.log("Order created successfully", order);
      // TODO: Redirect to payment gateway (e.g., crypto payment provider)
      // For now, just navigate to payments page
      navigate("/payments");
    } catch (error) {
      console.error("Failed to create order", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════
     MOBILE LAYOUT (< xl) — completely standalone
     ═══════════════════════════════════════════════ */
  const MobileLayout = () => (
    <div className="xl:hidden min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white overflow-x-hidden flex flex-col">
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#2cf6c3]/30 bg-[#05070A]/95 px-4 backdrop-blur-md">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-xs text-gray-400">
            EN <ChevronDown size={10} />
          </button>
          <Link
            to="/challenge"
            className="rounded-lg bg-[#00FFA3] px-3 py-1.5 text-[11px] font-bold text-black"
          >
            START
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── Horizontal Nav Tabs ── */}
      <nav className="flex gap-1 overflow-x-auto border-b border-[#1a2a32]/60 bg-[#05070A] px-4 py-2 scrollbar-hide">
        {mobileNavTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.route);
          return (
            <Link
              key={tab.route}
              to={tab.route}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isActive
                  ? "text-[#00FFA3]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Sidebar (slide-over, always overlay) ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-40 flex flex-col w-[269px] h-screen items-center justify-between px-0 py-[43px] bg-[#05070a] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col w-[210px] items-start gap-[5px]">
          {mobileNavTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.route);
            return (
              <Link
                key={tab.route}
                to={tab.route}
                onClick={() => setSidebarOpen(false)}
                className={`flex w-[210px] items-center gap-1.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-[#01ffa3] pl-[30px] pr-4" : "bg-transparent hover:bg-white/5 px-4"
                }`}
              >
                <span className={`[font-family:'Inter',Helvetica] text-[13.2px] tracking-[0] leading-5 whitespace-nowrap transition-colors ${
                  isActive ? "font-semibold text-[#05070a]" : "font-normal text-gray-300"
                }`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* ── Page Content ── */}
      <div className="flex-1 flex flex-col relative">
        {/* Background */}
        <img src="/images/bg-lines.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
        <img src="/images/bg-lines1.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen" />

        <div className="relative z-10 px-4 md:px-8 lg:px-12 py-5 md:py-8 flex-1 flex flex-col">
          {mobileStep === 1 ? <MobileStep1 /> : <MobileStep2 />}
        </div>
      </div>
    </div>
  );

  /* ── Mobile Step 1: Billing + Payment ── */
  const MobileStep1 = () => (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 flex-1">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tight">CHECKOUT</h1>
        <div className="mt-1 md:mt-2 flex items-center gap-1.5 text-xs md:text-sm">
          <Link to="/challenge" className="text-gray-500">New Challenge</Link>
          <span className="text-gray-600">›</span>
          <span className="text-[#00FFA3]">Order Confirmation</span>
        </div>
      </div>

      {/* Billing Details */}
      <section className="rounded-2xl border border-[#163e4a]/50 bg-[#08141c]/80 p-4 md:p-6 lg:p-8">
        <h3 className="mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-sm md:text-lg font-bold uppercase tracking-wider">
          <img src="/svg/billing-man.svg" alt="" className="h-5 w-5 md:h-6 md:w-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          Billing Details
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">
          <div>
            <label className="mb-1.5 md:mb-2 block text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
            <input
              value={user?.name ?? ""}
              readOnly
              className="h-11 md:h-14 lg:h-16 w-full rounded-lg border border-[#00ffa3]/20 bg-[#0b0f14] px-3 md:px-4 text-xs md:text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 md:mb-2 block text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-500">E-mail Address</label>
            <input
              value={user?.email ?? ""}
              readOnly
              className="h-11 md:h-14 lg:h-16 w-full rounded-lg border border-[#00ffa3]/20 bg-[#0b0f14] px-3 md:px-4 text-xs md:text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 md:mb-2 block text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Country/Region</label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-11 md:h-14 lg:h-16 w-full appearance-none rounded-lg border border-[#00ffa3]/20 bg-[#0b0f14] px-3 md:px-4 pr-8 text-xs md:text-sm text-white outline-none"
              >
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Germany</option>
                <option>Ukraine</option>
                <option>Poland</option>
                <option>Brazil</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 md:mb-2 block text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-500">City/Town</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 md:h-14 lg:h-16 w-full appearance-none rounded-lg border border-[#00ffa3]/20 bg-[#0b0f14] px-3 md:px-4 pr-8 text-xs md:text-sm text-white outline-none"
              >
                <option>London</option>
                <option>Manchester</option>
                <option>Birmingham</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="rounded-2xl border border-[#163e4a]/50 bg-[#08141c]/80 p-4 md:p-6 lg:p-8">
        <h3 className="mb-3 md:mb-5 flex items-center gap-2 md:gap-3 text-sm md:text-lg font-bold uppercase tracking-wider">
          <img src="/svg/wallet.svg" alt="" className="h-5 w-5 md:h-6 md:w-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          Payment Method
        </h3>
        <div className="flex items-center gap-3 md:gap-4 rounded-xl border border-[#00ffa3]/20 bg-[#0a1218] p-3 md:p-5 h-auto md:h-[90px] lg:h-[100px]">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border border-[#00ffa3]/20 bg-[#05070a] flex-shrink-0">
            <BtcIcon size={12} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-bold">CRYPTO PAYMENT</p>
            <p className="text-[10px] md:text-xs text-gray-500">BTC, ETH, USDT, USDC (Fast & Secure)</p>
          </div>
          <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full border-2 border-[#00FFA3] flex-shrink-0">
            <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#00FFA3]" />
          </div>
        </div>
      </section>

      {/* SSL badge */}
      <div className="flex items-center gap-3 md:gap-4 rounded-xl border border-[#1e3a42]/40 bg-[#050f15]/50 p-3 md:p-5 lg:p-6">
        <div className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#00FFA3]/10 text-[#00FFA3] flex-shrink-0">
          <ShieldCheck size={16} />
        </div>
        <div>
          <p className="text-[11px] md:text-sm font-bold">SSL SECURE PAYMENT</p>
          <p className="text-[9px] md:text-xs text-gray-500 leading-relaxed">Your information is protected by industry-leading encryption standards.</p>
        </div>
      </div>

      {/* COMPLETE ORDER → go to step 2 */}
      <button
        onClick={() => setMobileStep(2)}
        className="flex h-12 md:h-16 lg:h-18 w-full items-center justify-center rounded-xl md:rounded-2xl bg-[#00FFA3] text-sm md:text-lg font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895]"
      >
        COMPLETE ORDER
      </button>

      <NeedAssistance />
    </div>
  );

  /* ── Mobile Step 2: Order Summary ── */
  const MobileStep2 = () => (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 flex-1">
      {/* Order card */}
      <section className="rounded-2xl border border-[#163e4a]/50 bg-[#08141c]/80 p-5 md:p-8 lg:p-10">
        <h2 className="mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider">Your Order</h2>

        {/* Selected plan */}
        <div className="flex items-center justify-between rounded-xl border border-[#00ffa3]/20 bg-[#05070a] p-3.5 md:p-5 md:h-[90px] lg:h-[100px]">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border border-[#00ffa3]/20 bg-[#0b0f14] flex-shrink-0">
              <img src="/svg/diamond.svg" alt="" className="h-5 w-5 md:h-6 md:h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm md:text-base font-bold uppercase">{plan?.name ?? "Elite"} Challenge</p>
              <p className="text-[11px] md:text-sm text-gray-500">
                {plan ? `${(plan.balance / 1000).toFixed(0)}K Account Size` : "100K Account Size"}
              </p>
            </div>
          </div>
          <span className="text-lg md:text-xl font-bold flex-shrink-0">${plan?.fee ?? 799}.00</span>
        </div>

        {/* Line items */}
        <div className="mt-5 md:mt-8 space-y-2.5 md:space-y-4 text-sm md:text-base">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-white font-medium">${plan?.fee ?? 799}.00</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Platform Fee</span>
            <span className="text-[#00FFA3] font-medium">Free</span>
          </div>
        </div>

        <div className="my-4 md:my-6 h-px bg-gradient-to-r from-[#2cf6c3]/30 to-[#013226]/30" />

        {/* Total */}
        <div className="flex items-end justify-between">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">Total Amount</span>
          <span className="text-3xl md:text-4xl font-black">${plan?.fee ?? 799}.00</span>
        </div>

        {/* COMPLETE ORDER button */}
        <button
          onClick={handleOrder}
          disabled={loading || !plan}
          className="mt-6 md:mt-8 flex h-14 md:h-16 lg:h-18 w-full items-center justify-center rounded-2xl bg-[#00FFA3] text-lg md:text-xl font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895] disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          ) : (
            "COMPLETE ORDER"
          )}
        </button>

        {/* Privacy notice */}
        <div className="mt-5 md:mt-6 rounded-lg border border-white/5 bg-[#020617]/50 px-4 md:px-6 py-4 md:py-5">
          <p className="text-center text-[10px] md:text-xs leading-[1.6] text-gray-500">
            Your personal data will be used to process your order, support
            your experience throughout this website, and for other purposes described in
            our <span className="text-[#2cf6c3] cursor-pointer">Privacy Policy</span>
            . By completing the order, you agree to our Terms of Service.
          </p>
        </div>
      </section>

      <NeedAssistance />
    </div>
  );

  /* ═══════════════════════════════════════════════
     DESKTOP LAYOUT (>= xl) — uses DashboardLayout
     ═══════════════════════════════════════════════ */
  const DesktopLayout = () => (
    <div className="hidden xl:block">
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight">CHECKOUT</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-[#6e8a94]">
            <Link to="/challenge" className="text-[#00FFA3] hover:underline">New Challenge</Link>
            <span>›</span>
            <span>Order Confirmation</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: Billing + Payment */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3]/15 text-[#00FFA3]">
                  <ShieldCheck size={14} />
                </span>
                Billing Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">Full Name</label>
                  <input value={user?.name ?? ""} readOnly className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">E-mail Address</label>
                  <input value={user?.email ?? ""} readOnly className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">Country/Region</label>
                  <div className="relative">
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-12 w-full appearance-none rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 pr-10 text-sm text-white outline-none focus:border-[#00FFA3]/40">
                      <option>United Kingdom</option><option>United States</option><option>Germany</option><option>Ukraine</option><option>Poland</option><option>Brazil</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6570]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">City/Town</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none focus:border-[#00FFA3]/40" placeholder="London" />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3]/15 text-[#00FFA3]">
                  <BtcIcon size={14} />
                </span>
                Payment Method
              </h3>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#163e4a] bg-[#050f15]/50 p-4 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FFA3]/15">
                  <BtcIcon size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">CRYPTO PAYMENT</p>
                  <p className="text-xs text-[#6e8a94]">BTC, ETH, USDT, USDC (Fast & Secure)</p>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#00FFA3]">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00FFA3]" />
                </div>
              </label>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="h-fit rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
            <h3 className="mb-5 text-xl font-bold uppercase tracking-wider">Your Order</h3>
            <div className="flex items-center justify-between rounded-2xl border border-[#1e3a42] bg-[#050f15] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00FFA3]/15 text-[#00FFA3]"><ShieldCheck size={16} /></div>
                <div>
                  <p className="font-bold uppercase">{plan?.name ?? "Challenge"} Challenge</p>
                  <p className="text-xs text-[#6e8a94]">{plan ? `${(plan.balance / 1000).toFixed(0)}K Account Size` : "—"}</p>
                </div>
              </div>
              <span className="text-lg font-black">${plan?.fee ?? 0}.00</span>
            </div>
            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between text-[#afc0c9]"><span>Subtotal</span><span>${plan?.fee ?? 0}.00</span></div>
              <div className="flex justify-between text-[#afc0c9]"><span>Platform Fee</span><span className="text-[#00FFA3]">Free</span></div>
            </div>
            <div className="my-4 h-px bg-[#1e3a42]" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6e8a94]">Total Amount</span>
              <span className="text-4xl font-black">${plan?.fee ?? 0}.00</span>
            </div>
            <button onClick={handleOrder} disabled={loading || !plan} className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-[#00FFA3] text-base font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_24px_rgba(0,255,163,0.25)] disabled:opacity-50">
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : "COMPLETE ORDER"}
            </button>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-[#4a6570]">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
              <a href="#" className="text-[#00FFA3] underline">Privacy Policy</a>. By completing the order, you agree to our Terms of Service.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#1e3a42]/50 bg-[#050f15]/50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FFA3]/15 text-[#00FFA3]"><ShieldCheck size={16} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">SSL Secure Payment</p>
                <p className="text-[10px] text-[#4a6570]">Your information is protected by industry-leading encryption standards.</p>
              </div>
            </div>
          </aside>
        </div>
      </DashboardLayout>
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
    </>
  );
};
