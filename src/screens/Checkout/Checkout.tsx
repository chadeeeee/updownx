import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api, type Challenge } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { Bitcoin, ChevronDown, ShieldCheck } from "lucide-react";

export const Checkout = (): JSX.Element => {
  const { planId = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Challenge[]>([]);
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.challenges().then(setPlans).catch(() => setPlans([]));
  }, []);

  const plan = useMemo(() => plans.find((item) => item.id === planId), [plans, planId]);

  const handleOrder = async () => {
    if (!plan || !user) return;
    setLoading(true);
    try {
      await api.createOrder({
        userId: user.id,
        challengeId: plan.id,
        country,
        city,
        paymentMethod: "crypto",
      });
      navigate("/payments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">CHECKOUT</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-[#6e8a94]">
          <Link to="/challenge" className="text-[#00FFA3] hover:underline">New Challenge</Link>
          <span>›</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* ── Left: Billing + Payment ── */}
        <div className="space-y-6">
          {/* Billing details */}
          <section className="rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3]/15 text-[#00FFA3]">
                <ShieldCheck size={14} />
              </span>
              Billing Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">
                  Full Name
                </label>
                <input
                  value={user?.name ?? ""}
                  readOnly
                  className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">
                  E-mail Address
                </label>
                <input
                  value={user?.email ?? ""}
                  readOnly
                  className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">
                  Country/Region
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 pr-10 text-sm text-white outline-none focus:border-[#00FFA3]/40"
                  >
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Germany</option>
                    <option>Ukraine</option>
                    <option>Poland</option>
                    <option>Brazil</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6570]" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#4a6570]">
                  City/Town
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#1e3a42] bg-[#050f15] px-4 text-sm text-white outline-none focus:border-[#00FFA3]/40"
                  placeholder="London"
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3]/15 text-[#00FFA3]">
                <Bitcoin size={14} />
              </span>
              Payment Method
            </h3>
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#fffff] bg-[#fffff] p-4 transition-colors hover:border-[#fffff]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fffff]/15 text-[#f7931a]">
                <svg width="17" height="23" viewBox="0 0 17 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 22.5V20H0V17.5H2.5V5H0V2.5H3.75V0H6.25V2.5H8.75V0H11.25V2.65625C12.3333 2.94792 13.2292 3.53646 13.9375 4.42188C14.6458 5.30729 15 6.33333 15 7.5C15 8.10417 14.8958 8.68229 14.6875 9.23438C14.4792 9.78646 14.1875 10.2812 13.8125 10.7188C14.5417 11.1562 15.1302 11.75 15.5781 12.5C16.026 13.25 16.25 14.0833 16.25 15C16.25 16.375 15.7604 17.5521 14.7812 18.5312C13.8021 19.5104 12.625 20 11.25 20V22.5H8.75V20H6.25V22.5H3.75ZM5 10H10C10.6875 10 11.276 9.75521 11.7656 9.26562C12.2552 8.77604 12.5 8.1875 12.5 7.5C12.5 6.8125 12.2552 6.22396 11.7656 5.73438C11.276 5.24479 10.6875 5 10 5H5V10ZM5 17.5H11.25C11.9375 17.5 12.526 17.2552 13.0156 16.7656C13.5052 16.276 13.75 15.6875 13.75 15C13.75 14.3125 13.5052 13.724 13.0156 13.2344C12.526 12.7448 11.9375 12.5 11.25 12.5H5V17.5Z" fill="#00FFA3" />
                </svg>

              </div>
              <div className="flex-1">
                <p className="font-bold">CRYPTO PAYMENT</p>
                <p className="text-xs text-[#6e8a94]">BTC, ETH, USDT, USDC (Fast &amp; Secure)</p>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#00FFA3]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#00FFA3]" />
              </div>
            </label>
          </section>
        </div>

        {/* ── Right: Order summary ── */}
        <aside className="h-fit rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 p-6">
          <h3 className="mb-5 text-xl font-bold uppercase tracking-wider">Your Order</h3>

          {/* Selected plan */}
          <div className="flex items-center justify-between rounded-2xl border border-[#1e3a42] bg-[#050f15] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00FFA3]/15 text-[#00FFA3]">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-bold uppercase">{plan?.name ?? "Challenge"} Challenge</p>
                <p className="text-xs text-[#6e8a94]">
                  {plan ? `${(plan.balance / 1000).toFixed(0)}K Account Size` : "—"}
                </p>
              </div>
            </div>
            <span className="text-lg font-black">${plan?.fee ?? 0}.00</span>
          </div>

          {/* Subtotals */}
          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between text-[#afc0c9]">
              <span>Subtotal</span>
              <span>${plan?.fee ?? 0}.00</span>
            </div>
            <div className="flex justify-between text-[#afc0c9]">
              <span>Platform Fee</span>
              <span className="text-[#00FFA3]">Free</span>
            </div>
          </div>

          <div className="my-4 h-px bg-[#1e3a42]" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6e8a94]">
              Total Amount
            </span>
            <span className="text-4xl font-black">${plan?.fee ?? 0}.00</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading || !plan}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-[#00FFA3] text-base font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_24px_rgba(0,255,163,0.25)] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            ) : (
              "COMPLETE ORDER"
            )}
          </button>

          <p className="mt-4 text-center text-[10px] leading-relaxed text-[#4a6570]">
            Your personal data will be used to process your order, support your experience
            throughout this website, and for other purposes described in our{" "}
            <a href="#" className="text-[#00FFA3] underline">Privacy Policy</a>. By completing the
            order, you agree to our Terms of Service.
          </p>

          {/* SSL badge */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#1e3a42]/50 bg-[#050f15]/50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FFA3]/15 text-[#00FFA3]">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">SSL Secure Payment</p>
              <p className="text-[10px] text-[#4a6570]">
                Your information is protected by industry-leading encryption standards.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};
