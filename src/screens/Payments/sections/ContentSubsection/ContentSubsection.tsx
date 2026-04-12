import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaymentRecord } from "../../../../lib/api";
import { useTranslation } from "../../../../lib/i18n";

type StatusStyle = { bg: string; border: string; dot: string; text: string };

const STATUS_CONFIG: Record<string, StatusStyle> = {
  COMPLETED: { bg: "bg-[#00ffa3]/10", border: "border-[#00ffa3]/20", dot: "bg-[#00ffa3]", text: "text-[#00ffa3]" },
  PENDING: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", dot: "bg-yellow-500", text: "text-yellow-500" },
  FAILED: { bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", text: "text-red-500" },
  CANCELLED: { bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", text: "text-red-500" },
  default: { bg: "bg-gray-500/10", border: "border-gray-500/20", dot: "bg-gray-500", text: "text-gray-500" },
};

const STATUS_KEYS: Record<string, string> = {
  COMPLETED: "payments.completed",
  PENDING: "payments.pending",
  FAILED: "payments.failed",
  CANCELLED: "payments.cancelled",
};

const formatPaymentDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatPaymentTotal = (amount: number | string, currency?: string | null) => {
  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  const formatted = Number.isFinite(numericAmount)
    ? new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericAmount)
    : String(amount);

  return `${formatted} ${currency ? String(currency).toUpperCase() : "USD"}`;
};

interface ContentSubsectionProps {
  error: string | null;
  loading: boolean;
  onViewDetails: (id: number) => void;
  payments: PaymentRecord[];
}

export const ContentSubsection = ({
  error,
  loading,
  onViewDetails,
  payments,
}: ContentSubsectionProps): JSX.Element => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useTranslation();

  const totalPages = Math.max(1, Math.ceil(payments.length / itemsPerPage));
  const currentPage = Math.min(activePage, totalPages);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pagePayments = useMemo(
    () => payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [currentPage, itemsPerPage, payments],
  );

  const startItem = payments.length ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = payments.length ? Math.min(currentPage * itemsPerPage, payments.length) : 0;

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0b0f14] p-6 text-sm text-gray-400">
        {t("payments.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0b0f14] p-6 text-sm text-gray-400">
        {t("payments.no_payments")}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="hidden min-w-0 sm:grid sm:grid-cols-[minmax(140px,1.4fr)_minmax(110px,1fr)_minmax(110px,0.9fr)_minmax(120px,1fr)_auto] sm:items-center sm:gap-4 border-b border-[#1a1f26] px-2.5 py-2">
        <div className="min-w-0 font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">{t("payments.payment_id")}</div>
        <div className="min-w-0 font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">{t("payments.date")}</div>
        <div className="min-w-0 font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">{t("payments.status")}</div>
        <div className="min-w-0 font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">{t("payments.total")}</div>
        <div className="flex justify-end font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">{t("payments.actions")}</div>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 2xl:gap-3">
        {pagePayments.map((payment) => {
          const config = STATUS_CONFIG[payment.status] || STATUS_CONFIG.default;
          const payCurrency = payment.pay_currency || "usd";
          const nowPaymentsId = payment.provider_payment_id || payment.provider_invoice_id || "—";

          return (
            <div
              key={payment.id}
              className="grid h-[36px] w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1 self-stretch rounded-lg border border-transparent bg-[#0b0f14] px-1 transition-all shadow-sm hover:border-white/5 min-[375px]:h-[42px] min-[375px]:gap-2 min-[375px]:px-2 sm:h-[56px] sm:grid-cols-[minmax(140px,1.4fr)_minmax(110px,1fr)_minmax(110px,0.9fr)_minmax(120px,1fr)_auto] sm:gap-4 sm:px-4 sm:rounded-xl 2xl:h-[70px] 2xl:px-8 2xl:rounded-2xl"
            >
              <div className="flex min-w-0 items-center overflow-hidden">
                <span className="truncate font-inter font-bold leading-none text-white text-[7px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base">
                  {nowPaymentsId}
                </span>
              </div>

              <div className="hidden min-w-0 items-center overflow-hidden sm:flex">
                <div className="truncate font-inter font-normal leading-none text-[#c2c5cd] text-[6.5px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base">
                  {formatPaymentDate(payment.created_at)}
                </div>
              </div>

              <div className="flex items-center sm:min-w-0">
                <div className={`inline-flex items-center gap-[1px] sm:gap-2 px-0.5 py-[1px] min-[375px]:px-1 min-[375px]:py-[2px] sm:px-3 sm:py-1 ${config.bg} rounded-full border border-solid ${config.border}`}>
                  <div className={`w-[2px] h-[2px] min-[375px]:w-[3px] min-[375px]:h-[3px] sm:w-[5px] sm:h-[5px] ${config.dot} rounded-full shadow-[0_0_8px_currentColor]`} />
                  <span className={`font-inter font-bold ${config.text} text-[4px] min-[375px]:text-[6px] sm:text-[9px] tracking-[0.50px] uppercase whitespace-nowrap leading-none`}>
                    {STATUS_KEYS[payment.status] ? t(STATUS_KEYS[payment.status]) : payment.status}
                  </span>
                </div>
              </div>

              <div className="hidden min-w-0 items-center overflow-hidden sm:flex">
                <div className="flex min-w-0 items-center gap-[1px] sm:gap-2">
                  <div className="truncate font-inter font-bold leading-none text-white text-[7px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base">
                    {formatPaymentTotal(payment.amount, payCurrency)}
                  </div>
                  <div className="font-inter font-medium text-[#00ffa3] text-[5px] min-[375px]:text-[7px] sm:text-[9px] leading-none whitespace-nowrap shrink-0">
                    / 1 {t("payments.items")}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="h-3.5 min-[375px]:h-5 sm:h-7 2xl:h-9 px-1 min-[375px]:px-2 sm:px-4 2xl:px-5 bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-full flex items-center justify-center cursor-pointer transition-all border border-[#00ffa3]/20"
                  onClick={() => onViewDetails(payment.id)}
                >
                  <span className="font-inter font-bold text-[#05070a] text-[5.5px] min-[375px]:text-[7px] sm:text-[10px] 2xl:text-xs whitespace-nowrap shrink-0">
                    {t("payments.view_details")}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden xl:flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
        <div className="font-inter font-normal text-gray-500 text-[11px]">
          {t("payments.showing")} <span className="text-white">{startItem}</span> {t("payments.to")} <span className="text-white">{endItem}</span> {t("payments.of")} {payments.length} {t("payments.entries")}
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="w-8 h-8 rounded-lg border border-white/5 bg-transparent hover:bg-white/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => setActivePage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-lg font-inter font-bold text-[11px] transition-all border ${
                  currentPage === page
                    ? "bg-[#00ffa3] text-black border-transparent shadow-[0_0_12px_rgba(0,255,163,0.2)]"
                    : "bg-transparent text-gray-400 border-white/5 hover:bg-white/5"
                }`}
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="w-8 h-8 rounded-lg border border-white/5 bg-transparent hover:bg-white/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => setActivePage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex xl:hidden w-full mt-3 sm:mt-6">
        <div className="w-full rounded-2xl border border-[#163a3c] bg-gradient-to-r from-[#061616] to-[#0b1f1f] p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-4 shadow-lg">
          <span className="text-white text-[11px] sm:text-base font-medium">{t("sidebar.need_assistance")}</span>
          <div className="flex flex-row gap-2 sm:gap-4">
            <button className="flex-1 bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black text-[9px] sm:text-sm font-bold min-h-[34px] sm:min-h-[44px] py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-colors w-full">
              {t("sidebar.contact_support")}
            </button>
            <button className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[9px] sm:text-sm font-medium min-h-[34px] sm:min-h-[44px] py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-colors w-full">
              {t("sidebar.help")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
