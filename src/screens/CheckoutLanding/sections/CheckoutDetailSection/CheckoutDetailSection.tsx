import { Button } from "../../../../components/ui/button";
import type { Challenge } from "../../../../lib/api";
import { useTranslation } from "../../../../lib/i18n";

const gradientCardClass =
  "relative bg-[#05070a] rounded-xl border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value?: number) =>
  typeof value === "number" ? currencyFormatter.format(value) : "$0.00";

const formatAccountSize = (value?: number) =>
  typeof value === "number" ? `${(value / 1000).toFixed(0)}K Account Size` : "—";

interface CheckoutDetailSectionProps {
  city: string;
  country: string;
  fullName: string;
  email: string;
  loading: boolean;
  couponCode: string;
  couponApplied: boolean;
  couponDiscount: number;
  couponError: string | null;
  couponValidating: boolean;
  finalAmountLabel: string;
  onApplyCoupon: () => void;
  onCityChange: (value: string) => void;
  onCompleteOrder: () => void;
  onCouponCodeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  plan?: Challenge;
}

export const CheckoutDetailSection = ({
  city,
  country,
  fullName,
  email,
  loading,
  couponCode,
  couponApplied,
  couponDiscount,
  couponError,
  couponValidating,
  finalAmountLabel,
  onApplyCoupon,
  onCityChange,
  onCompleteOrder,
  onCouponCodeChange,
  onCountryChange,
  onEmailChange,
  onFullNameChange,
  plan,
}: CheckoutDetailSectionProps): JSX.Element => {
  const challengeLabel = plan ? `${plan.name.toUpperCase()} CHALLENGE` : "CHALLENGE";
  const accountSizeLabel = formatAccountSize(plan?.balance);
  const amountLabel = formatAmount(plan?.fee);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full items-start justify-center gap-5 pr-8 pb-8">
      <div className="flex items-start gap-5 w-full">
        <div className="flex flex-col flex-1 items-start gap-[34px]">
          <div className={`${gradientCardClass} flex flex-col gap-8 w-full p-[33px]`}>
            <div className="flex items-center gap-3 h-7">
              <img
                className="w-6 h-7 flex-shrink-0"
                alt="Billing icon"
                src="/svg/billing-man.svg"
              />
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7 whitespace-nowrap">
                {t("checkout.billing_title")}
              </span>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    {t("checkout.full_name")}
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden">
                    <input
                      value={fullName}
                      onChange={(event) => onFullNameChange(event.target.value)}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    {t("checkout.email")}
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden">
                    <input
                      value={email}
                      onChange={(event) => onEmailChange(event.target.value)}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    {t("checkout.country")}
                  </label>
                  <div className="flex items-center h-[50px] bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] px-4">
                    <input
                      value={country}
                      onChange={(event) => onCountryChange(event.target.value)}
                      placeholder={t("checkout.enter_country")}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    {t("checkout.city")}
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden">
                    <input
                      value={city}
                      onChange={(event) => onCityChange(event.target.value)}
                      placeholder={t("checkout.enter_city")}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${gradientCardClass} flex flex-col gap-6 w-full p-[33px]`}>
            <div className="flex items-center gap-3 h-7">
              <img
                className="w-6 h-7 flex-shrink-0"
                alt="Wallet icon"
                src="/svg/wallet.svg"
              />
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7 whitespace-nowrap">
                {t("checkout.payment_method")}
              </span>
            </div>

            <div
              className="relative w-full h-[92px] bg-[#2cf6c30d] rounded-xl border-none
                before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-xl
                before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
                before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                before:z-[1] before:pointer-events-none"
            >
              <div className="flex items-center gap-4 absolute top-1/2 -translate-y-1/2 left-[22px]">
                <div className="w-12 h-12 flex items-center justify-center bg-[#05070a] rounded-lg border border-solid border-[#00ffa333] flex-shrink-0">
                  <img
                    className="w-[17px] h-[23px] flex-shrink-0"
                    alt="Crypto icon"
                    src="/svg/btc.svg"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                    {t("checkout.crypto_payment")}
                  </span>
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                    {t("checkout.crypto_sub")}
                  </span>
                </div>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 right-[22px] w-6 h-6 border-2 border-solid rounded-full border-[#00ffa3] flex items-center justify-center bg-[#00ffa333]">
                <img src="/svg/tick.svg" alt="selected" className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className={`${gradientCardClass} flex flex-col gap-6 w-full p-[33px]`}>
            <div className="flex flex-col gap-1">
              <h3 className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-[22px] tracking-tight m-0 p-0 text-left">
                {t("checkout.coupon_title")}
              </h3>
              <p className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-[15px] m-0 p-0 mb-1 text-left">
                {t("checkout.coupon_sub")}
              </p>
            </div>
            <div className="flex items-center h-[56px] px-5 bg-[#0b0f14] rounded-xl border border-solid border-[#ffffff1a] transition-all focus-within:border-[#00ffa3]/40">
              <input
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                placeholder={t("checkout.coupon_placeholder")}
                className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-wide leading-6 placeholder:text-gray-600"
                disabled={couponApplied}
              />
            </div>
            {couponApplied && (
              <p className="text-[#00FFA3] text-sm font-semibold">
                {t("checkout.coupon_applied").replace("{percent}", String(couponDiscount))}
              </p>
            )}
            {couponError && (
              <p className="text-red-400 text-sm font-semibold">{couponError}</p>
            )}
            <Button
              onClick={onApplyCoupon}
              disabled={couponApplied || couponValidating || !couponCode.trim()}
              className="w-full h-14 bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl [font-family:'Public_Sans',Helvetica] font-bold text-black text-[15px] uppercase tracking-widest border-none mt-2 disabled:opacity-60"
            >
              {couponValidating ? t("checkout.coupon_validating") : t("checkout.coupon_apply")}
            </Button>
          </div>

          <div
            className={`${gradientCardClass} inline-flex items-center gap-4 p-[25px] w-full flex-shrink-0 backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]`}
          >
            <div className="w-12 h-12 rounded-full bg-[#00ffa31a] flex items-center justify-center flex-shrink-0">
              <img
                className="w-4 h-5 flex-shrink-0"
                alt="SSL Secure"
                src="/svg/ssl-secure.svg"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xs tracking-[-0.30px] leading-4 whitespace-nowrap">
                {t("checkout.ssl_title")}
              </span>
              <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
                {t("checkout.ssl_sub")}
              </span>
            </div>
          </div>
        </div>

        <div className={`${gradientCardClass} flex flex-col gap-8 w-[448px] p-[33px] flex-shrink-0`}>
          <h2 className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7">
            {t("checkout.your_order")}
          </h2>

          <div
            className="relative w-full h-[74px] bg-[#05070a] rounded-lg border-none
              before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg
              before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
              before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
              before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
              before:z-[1] before:pointer-events-none"
          >
            <div className="flex items-center justify-between h-full px-[17px]">
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] flex-shrink-0">
                  <img
                    className="w-6 h-6 flex-shrink-0"
                    alt="Challenge"
                    src="/svg/diamond.svg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {challengeLabel}
                  </span>
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                    {accountSizeLabel}
                  </span>
                </div>
              </div>
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                {amountLabel}
              </span>
            </div>
          </div>

          <div
            className="flex flex-col gap-2.5 w-full pt-2.5 border-t border-transparent"
            style={{
              borderImage:
                "linear-gradient(227deg,rgba(44,246,195,0.3) 0%,rgba(1,50,38,0.3) 100%) 1",
            }}
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between w-full h-5">
                <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {t("checkout.subtotal")}
                </span>
                <span className={`[font-family:'Public_Sans',Helvetica] text-sm tracking-[0] leading-5 whitespace-nowrap font-medium ${couponApplied ? "line-through text-gray-500" : "text-white"}`}>
                  {amountLabel}
                </span>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between w-full h-5">
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-[#00FFA3] text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {t("checkout.discount")} (-{couponDiscount}%)
                  </span>
                  <span className="[font-family:'Public_Sans',Helvetica] text-sm tracking-[0] leading-5 whitespace-nowrap text-[#00FFA3] font-medium">
                    {finalAmountLabel}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between w-full h-5">
                <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {t("checkout.platform_fee")}
                </span>
                <span className="[font-family:'Public_Sans',Helvetica] text-sm tracking-[0] leading-5 whitespace-nowrap text-[#00ffa3] font-medium">
                  {t("checkout.free")}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between w-full mt-4">
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                {t("checkout.total_amount")}
              </span>
              <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl tracking-[0] leading-9 whitespace-nowrap">
                {couponApplied ? finalAmountLabel : amountLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0 w-full">
            <Button
              disabled={loading || !plan}
              onClick={onCompleteOrder}
              className="w-full h-[60px] bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl shadow-[0px_4px_6px_-4px_#a3e63533,0px_10px_15px_-3px_#a3e63533] [font-family:'Public_Sans',Helvetica] font-black text-slate-950 text-lg text-center tracking-[-0.90px] leading-7 whitespace-nowrap border-none disabled:opacity-60"
              style={{ height: "60px" }}
            >
              {loading ? t("checkout.processing") : t("checkout.complete_order")}
            </Button>

            <div className="w-full mt-7 bg-[#02061780] rounded-lg border border-solid border-[#ffffff0d] px-[17px] py-[17px]">
              <p className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-[10px] text-center tracking-[0] leading-[16.2px]">
                {t("checkout.privacy_text")}{" "}
                <span className="text-[#2cf6c3] cursor-pointer">
                  {t("checkout.privacy_policy")}
                </span>
                . {t("checkout.terms_text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
