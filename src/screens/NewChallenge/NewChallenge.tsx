import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api, type Challenge } from "../../lib/api";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const NewChallenge = (): JSX.Element => {
  const [plans, setPlans] = useState<Challenge[]>([]);

  useEffect(() => {
    // Емуляція завантаження або реальний запит
    api.challenges()
      .then(setPlans)
      .catch(() => setPlans([]));
  }, []);

  return (
    <DashboardLayout>
      {/* Event banner */}
      <section className="mb-12 rounded-3xl border border-[#1e5e5c]/50 bg-gradient-to-br from-[#0e3b3f]/50 to-[#061e22]/50 p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00FFA3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#021a14]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#021a14]" />
            Event Live
          </span>
        </div>
        <h2 className="text-4xl font-black leading-tight tracking-tight text-white">
          WSCT Blockchain Forum 2026 –
          <br />
          Qualifying Tour
        </h2>
        <p className="mt-3 max-w-2xl text-[#89a4ad]">
          Join the elite circle of institutional-grade traders. Complete the qualifying assessment
          during the WSCT Forum and gain access to a dedicated $1M pool.
        </p>
        <Link
          to="/event-live"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00FFA3] px-6 py-3 font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.2)]"
        >
          Read the rules <ArrowRight size={16} />
        </Link>
      </section>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 items-start">
        {plans.map((plan) => {
          const isPro = plan.id.toLowerCase().includes("pro");

          return (
            <div key={plan.id} className="flex flex-col gap-4">
              {/* Основна картка з контентом */}
              <article
                className={`relative flex flex-col rounded-[24px] border p-6 transition-all min-h-[420px] ${
                  isPro
                    ? "border-[#00FFA3] bg-[#020b11] ring-1 ring-[#00FFA3]"
                    : "border-[#1a242c] bg-[#0d141a]"
                }`}
              >
                {/* Badge "Most Popular" */}
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="rounded-full bg-[#00FFA3] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-black whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <h3 className={`text-[12px] font-bold uppercase tracking-[0.2em] mb-4 ${isPro ? 'text-[#00FFA3]' : 'text-[#8ea4ad]'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">
                      ${plan.balance.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#5e747e] tracking-widest mt-1">
                      Account Balance
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {[
                    "2 Step Assessment",
                    "Unlimited Trading",
                    "Up to 80% Profit Split",
                    "Challenge Fee",
                    "160+ Cryptos",
                    "1:5 Leverage",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-[#00FFA3] shrink-0" />
                      <span className="text-[13px] text-[#8ea4ad] font-medium leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Секція оплати (під карткою) */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-[#42555e] tracking-widest">
                    {plan.name}
                  </span>
                  <span className="text-xl font-black text-white leading-none mt-1">
                    ${plan.fee}
                  </span>
                </div>
                
                <Link
                  to={`/checkout/${plan.id}?method=crypto`}
                  className="group flex w-full items-center justify-center rounded-xl bg-[#00FFA3] py-3.5 text-[13px] font-black uppercase tracking-wider text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_15px_rgba(0,255,163,0.3)]"
                >
                  Crypto Payment
                </Link>
                
                <Link
                  to={`/checkout/${plan.id}?method=pix`}
                  className="flex w-full items-center justify-center rounded-xl border border-[#1a242c] bg-[#0d141a] py-3.5 text-[13px] font-black uppercase tracking-wider text-[#8ea4ad] transition-all hover:bg-[#1a242c] hover:text-white"
                >
                  PIX
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};