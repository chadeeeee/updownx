import type { PaymentRecord } from "../../../../lib/api";

type StatusStyle = { bg: string; border: string; dot: string; text: string };

const STATUS_CONFIG: Record<string, StatusStyle> = {
  COMPLETED: { bg: "bg-[#00ffa3]/10", border: "border-[#00ffa3]/20", dot: "bg-[#00ffa3]", text: "text-[#00ffa3]" },
  PENDING: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", dot: "bg-yellow-500", text: "text-yellow-500" },
  CANCELLED: { bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", text: "text-red-500" },
  default: { bg: "bg-gray-500/10", border: "border-gray-500/20", dot: "bg-gray-500", text: "text-gray-500" },
};

const renderStatusBadge = (status: string) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${config.bg} ${config.border}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
      <span className={`text-xs font-bold tracking-[0.12em] ${config.text}`}>{status}</span>
    </div>
  );
};

interface PaymentDetailSectionProps {
  error: string | null;
  loading: boolean;
  payment: PaymentRecord | null;
}

export const PaymentDetailSection = ({
  error,
  loading,
  payment,
}: PaymentDetailSectionProps): JSX.Element => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#0b0f14] p-6 text-sm text-gray-400">
        Loading payment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#0b0f14] p-6 text-sm text-gray-400">
        Payment not found.
      </div>
    );
  }

  const statusLabel = (payment.status || "NOT_AVAILABLE").toUpperCase();
  const nowPaymentsId = payment.provider_payment_id || payment.provider_invoice_id || "—";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="rounded-3xl border border-white/5 bg-[#0b0f14] p-5 sm:p-6 lg:p-8">
        {/* Header with title and status on the same line */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Payment Details</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{payment.challenge_name.toUpperCase()} CHALLENGE</h2>
          </div>

          <div className="flex items-center gap-3 self-end mb-1">{renderStatusBadge(statusLabel)}</div>
        </div>

        {/* Thank you message */}
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00ffa3]/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ffa3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white tracking-[-0.2px]">Thank you for your payment!</h3>
          <p className="text-sm text-gray-400">Your payment has been processed successfully.</p>
        </div>

        {/* Payment ID */}
        <div className="rounded-2xl border border-white/5 bg-[#08141c] p-5">
          <div className="flex items-center justify-between gap-4 text-sm text-white">
            <span className="text-gray-400">Payment ID</span>
            <span className="break-all text-right font-mono font-semibold">{nowPaymentsId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
