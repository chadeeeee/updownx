import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { Link } from "react-router-dom";

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

export const Accounts = (): JSX.Element => {
  const { user } = useAuth();
  const [data, setData] = useState<AccountPayload>({ user: null, orders: [] });
  const [activeTab, setActiveTab] = useState<string>("CHALLENGE");

  useEffect(() => {
    if (!user) return;
    api.accounts(user.id).then(setData).catch(() => setData({ user: null, orders: [] }));
  }, [user]);

  const hasOrders = data.orders.length > 0;

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
        /* ── Account cards ── */
        <div className="space-y-6">
          {data.orders.map((order) => {
            const accountId = `20005${String(order.id).padStart(4, "0")}`;
            const tierName = order.challenge_name.toUpperCase();
            const balance = order.amount >= 199 ? 100000 : order.amount >= 99 ? 25000 : order.amount >= 49 ? 5000 : 799;

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
                        STATUS/CHALLENGE
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
                      <p className="text-base font-bold">{(balance * 0.05).toLocaleString()}.00 USDT</p>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex min-w-[180px] flex-col items-center justify-center gap-3 p-6">
                    <button className="w-full rounded-xl bg-[#00FFA3] py-3 text-sm font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_16px_rgba(0,255,163,0.2)]">
                      Trade
                    </button>
                    <button className="w-full rounded-xl border border-[#2a4e58] bg-[#0b1f28] py-3 text-sm font-medium text-[#afc0c9] transition-colors hover:border-[#00FFA3]/40 hover:text-white">
                      Control Panel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty / 404 state ── */
        <section className="flex flex-col items-center py-16 text-center">
          {/* Chart icon */}
          <div className="mb-4 flex h-[100px] w-[160px] items-end justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#0e3d43]/80 to-[#082a30]/60 p-4 shadow-[0_8px_32px_rgba(0,255,163,0.06)]">
            <div className="h-[36px] w-[12px] rounded-sm bg-[#00ffa3]/70" />
            <div className="h-[52px] w-[12px] rounded-sm bg-[#00ffa3]" />
            <div className="h-[30px] w-[12px] rounded-sm bg-[#ff4d4d]/80" />
            <div className="h-[42px] w-[12px] rounded-sm bg-[#ff4d4d]" />
            <div className="h-[48px] w-[12px] rounded-sm bg-[#00ffa3]" />
            <div className="h-[22px] w-[12px] rounded-sm bg-[#00ffa3]/60" />
          </div>

          <svg className="mb-5 text-[#00ffa3]" width="32" height="24" viewBox="0 0 40 28" fill="none">
            <path d="M2 22L12 12L18 18L28 6M28 6H22M28 6V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
            <path d="M37 23L39 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <h2 className="text-3xl font-bold">
            Sorry, this page is available
            <br />
            only to traders.
          </h2>
          <p className="mt-4 max-w-md text-[#6e8188]">
            Traders are individuals who have successfully completed the Evaluation Process and manage
            a Hash Hedge trading account.
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
