import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ContentSubsection } from "./sections/ContentSubsection";
import { PaymentDetailSection } from "./sections/PaymentDetailSection/PaymentDetailSection";
import { DashboardLayout } from "../../components/DashboardLayout";
import { ApiError, api, type PaymentRecord } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslation } from "../../lib/i18n";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

const mobileNavTabs = [
  { labelKey: "nav.new_challenge", route: "/challenge" },
  { labelKey: "nav.accounts", route: "/accounts" },
  { labelKey: "nav.payments", route: "/payments" },
  { labelKey: "nav.withdrawals", route: "/withdrawals" },
];

const samePaymentRecord = (left: PaymentRecord | null, right: PaymentRecord | null) => {
  if (!left || !right) {
    return left === right;
  }

  return (
    left.id === right.id &&
    left.challenge_order_id === right.challenge_order_id &&
    left.challenge_id === right.challenge_id &&
    left.challenge_name === right.challenge_name &&
    left.amount === right.amount &&
    left.billing_full_name === right.billing_full_name &&
    left.billing_email === right.billing_email &&
    left.country === right.country &&
    left.city === right.city &&
    left.payment_method === right.payment_method &&
    left.status === right.status &&
    left.provider === right.provider &&
    left.provider_invoice_id === right.provider_invoice_id &&
    left.provider_payment_id === right.provider_payment_id &&
    left.merchant_order_id === right.merchant_order_id &&
    left.payment_url === right.payment_url &&
    left.pay_address === right.pay_address &&
    left.pay_amount === right.pay_amount &&
    left.pay_currency === right.pay_currency &&
    left.demo_mode === right.demo_mode &&
    left.created_at === right.created_at &&
    left.updated_at === right.updated_at
  );
};

const samePaymentList = (left: PaymentRecord[], right: PaymentRecord[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((payment, index) => samePaymentRecord(payment, right[index] || null));
};

export const Payments = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();

  const numericPaymentId = Number(paymentId);
  const routePaymentId = Number.isFinite(numericPaymentId) && numericPaymentId > 0 ? numericPaymentId : null;
  const activePaymentId = selectedPaymentId ?? routePaymentId;
  const isDetailOpen = activePaymentId !== null;

  const isMobileTabActive = (route: string) => location.pathname.startsWith(route);

  const loadPayments = useCallback(async (options?: { silent?: boolean }) => {
    if (!user) {
      return;
    }

    const silent = options?.silent ?? false;

    if (!silent && !payments.length) {
      setPaymentsLoading(true);
    }

    if (!silent) {
      setPaymentsError(null);
    }

    try {
      const nextPayments = await api.payments(user.id);
      setPayments((current) => (samePaymentList(current, nextPayments) ? current : nextPayments));
    } catch (error) {
      if (!silent) {
        setPaymentsError(error instanceof ApiError ? error.message : t("payments.error_list"));
      }
    } finally {
      if (!silent) {
        setPaymentsLoading(false);
      }
    }
  }, [payments.length, user]);

  const loadPaymentDetail = useCallback(async (options?: { silent?: boolean }) => {
    if (!user || activePaymentId === null) {
      return;
    }

    const silent = options?.silent ?? false;

    if (!silent && !paymentDetail) {
      setDetailLoading(true);
    }

    if (!silent) {
      setDetailError(null);
    }

    try {
      const response = await api.payment(user.id, activePaymentId);
      setPaymentDetail((current) => (samePaymentRecord(current, response.payment) ? current : response.payment));
    } catch (error) {
      if (!silent) {
        setDetailError(error instanceof ApiError ? error.message : t("payments.error"));
      }
    } finally {
      if (!silent) {
        setDetailLoading(false);
      }
    }
  }, [activePaymentId, user]);

  useEffect(() => {
    if (!user || isDetailOpen) {
      return;
    }

    loadPayments();
    const intervalId = window.setInterval(() => {
      loadPayments({ silent: true });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [isDetailOpen, loadPayments, user]);

  useEffect(() => {
    if (!user || activePaymentId === null) {
      setPaymentDetail(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    loadPaymentDetail();
    const intervalId = window.setInterval(() => {
      loadPaymentDetail({ silent: true });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [activePaymentId, loadPaymentDetail, user]);

  const handleViewDetails = (id: number) => {
    setSelectedPaymentId(id);
  };

  const handleCloseDetails = () => {
    if (paymentDetail) {
      setPayments((current) =>
        current.map((payment) => (payment.id === paymentDetail.id ? (samePaymentRecord(payment, paymentDetail) ? payment : paymentDetail) : payment)),
      );
    }
    setSelectedPaymentId(null);
    if (routePaymentId !== null) {
      navigate("/payments", { replace: true });
    }
  };

  const PageContent = () => (
    <div className="relative z-10 flex w-full min-w-0 flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-3xl tracking-[-0.5px]">
          {t("payments.title")}
        </h1>
        <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-sm lg:text-base">
          {t("payments.subtitle")}
        </p>
      </div>

      <div className="w-full">
        <ContentSubsection
          error={paymentsError}
          loading={paymentsLoading}
          onViewDetails={handleViewDetails}
          payments={payments}
        />
      </div>

      {isDetailOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={handleCloseDetails}>
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto animate-in slide-in-from-bottom-4 fade-in zoom-in-95 duration-400" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={handleCloseDetails}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#08141c] text-white transition-colors hover:bg-[#0d1f28]"
              aria-label="Close payment details"
            >
              <X className="h-5 w-5" />
            </button>
            <PaymentDetailSection error={detailError} loading={detailLoading} payment={paymentDetail} />
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070A]">
        <img
          className="absolute top-20 left-0 w-full h-full object-cover opacity-50 bg-blend-screen"
          alt=""
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-51-40-1.png"
        />
        <img
          className="absolute top-20 left-0 w-full h-full object-cover opacity-40"
          alt=""
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1-1.png"
        />
      </div>

      <div className="xl:hidden w-full overflow-x-clip flex flex-col min-h-screen font-['Inter',sans-serif] text-white relative z-10">
        <header className="sticky top-0 z-50 flex h-14 md:h-16 lg:h-20 items-center justify-between bg-[#05070A]/95 px-3 backdrop-blur-md min-[375px]:px-4 md:px-6 lg:px-10 border-b border-[#1a2a32]/60">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="UPDOWNX" className="h-6 w-auto object-contain min-[375px]:h-7 md:h-9 lg:h-12" />
          </Link>
          <div className="flex items-center gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-6">
            <LanguageSwitcher size="sm" />
            <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px] md:px-5 md:py-2 md:text-sm lg:px-8 lg:py-3 lg:text-lg md:rounded-xl">
              {t("trading.start")}
            </Link>
            <button onClick={() => setSidebarOpen((p) => !p)} className="text-gray-300 hover:text-white md:p-1 lg:p-2" aria-label="Toggle menu">
              {sidebarOpen ? <X className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" /> : <Menu className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" />}
            </button>
          </div>
        </header>

        {sidebarOpen && (
          <nav className="flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full shadow-lg">
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

        <div className="flex-1 overflow-x-clip">
          <PageContent />
        </div>
      </div>

      <div className="hidden xl:block">
        <DashboardLayout>
          <div className="flex flex-col gap-6 2xl:gap-10">
            <PageContent />
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};
