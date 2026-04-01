import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/DashboardLayout";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { CreditCard, Download } from "lucide-react";

type Payment = {
  id: number;
  challenge_name: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export const Payments = (): JSX.Element => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!user) return;
    api.payments(user.id).then(setPayments).catch(() => setPayments([]));
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">Payments</h1>
        <button className="flex items-center gap-2 rounded-xl border border-[#1e3a42] bg-[#0a1a22] px-4 py-2.5 text-sm text-[#afc0c9] transition-colors hover:border-[#00FFA3]/30 hover:text-white">
          <Download size={14} />
          Export
        </button>
      </div>

      <section className="rounded-3xl border border-[#163e4a]/60 bg-[#08141c]/80 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 border-b border-[#163e4a]/40 px-6 py-3.5">
          {["Challenge", "Amount", "Method", "Status", "Date"].map((h) => (
            <span
              key={h}
              className="text-[10px] font-bold uppercase tracking-widest text-[#4a6570]"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        <div className="divide-y divide-[#163e4a]/30">
          {payments.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-6 py-4 transition-colors hover:bg-[#0d1e28]/50"
            >
              <span className="flex items-center gap-2 font-medium">
                <CreditCard size={14} className="text-[#00FFA3]" />
                {p.challenge_name} Challenge
              </span>
              <span className="font-bold">${p.amount}</span>
              <span className="capitalize text-[#afc0c9]">{p.payment_method}</span>
              <span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    p.status === "paid"
                      ? "bg-[#00FFA3]/10 text-[#00FFA3]"
                      : p.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.status === "paid"
                        ? "bg-[#00FFA3]"
                        : p.status === "pending"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                  {p.status}
                </span>
              </span>
              <span className="text-sm text-[#6e8a94]">
                {new Date(p.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}

          {payments.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <CreditCard size={32} className="text-[#2a4e58]" />
              <p className="text-lg font-medium text-[#6e8a94]">No payments yet</p>
              <p className="text-sm text-[#4a6570]">
                Your payment history will appear here after your first purchase.
              </p>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};
