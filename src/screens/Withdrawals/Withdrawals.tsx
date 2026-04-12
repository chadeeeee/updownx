import { Link } from "react-router-dom";
import { DashboardLayout } from "../../components/DashboardLayout";
import { useTranslation } from "../../lib/i18n";

const WithdrawalsNotFound = () => {
  const { t } = useTranslation();
  return (
  <section className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center px-5 text-center">
    <div className="mb-4 flex h-[120px] w-[180px] items-end justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#0e3d43]/80 to-[#082a30]/60 p-5 shadow-[0_8px_32px_rgba(0,255,163,0.08)]">
      <div className="h-[50px] w-[14px] rounded-sm bg-[#00ffa3]/70" />
      <div className="h-[70px] w-[14px] rounded-sm bg-[#00ffa3]" />
      <div className="h-[40px] w-[14px] rounded-sm bg-[#ff4d4d]/80" />
      <div className="h-[55px] w-[14px] rounded-sm bg-[#ff4d4d]" />
      <div className="h-[65px] w-[14px] rounded-sm bg-[#00ffa3]" />
      <div className="h-[30px] w-[14px] rounded-sm bg-[#00ffa3]/60" />
    </div>

    <svg
      className="mb-6 text-[#00ffa3]"
      width="40"
      height="28"
      viewBox="0 0 40 28"
      fill="none"
    >
      <path
        d="M2 22L12 12L18 18L28 6M28 6H22M28 6V12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M37 23L39 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>

    <h1 className="text-[42px] font-bold leading-tight tracking-tight whitespace-pre-line">
      {t("page.not_available_title")}
    </h1>

    <p className="mt-4 max-w-[460px] text-base leading-relaxed text-[#6e8188] whitespace-pre-line">
      {t("page.not_available_desc")}
    </p>

    <Link
      to="/challenge"
      className="mt-10 inline-block rounded-xl bg-[#00FFA3] px-10 py-3.5 text-lg font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
    >
      {t("page.new_challenge")}
    </Link>
  </section>
);}

export const Withdrawals = (): JSX.Element => {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center py-6 sm:py-8 lg:py-12">
        <WithdrawalsNotFound />
      </div>
    </DashboardLayout>
  );
};
