import { useState } from "react";
import { useTranslation } from "../../../../lib/i18n";

// Account size tab options
const accountSizeTabs = ["5K", "50K", "100K"];

// Pricing plans data
const pricingPlans = [
  {
    id: "shark",
    name: "SHARK",
    subtitle: "pricing.for_serious",
    accountSize: "$50,000",
    price: "$399",
    featured: true,
    borderClass:
      "border-2 border-solid border-[#00ffa3] shadow-[0px_0px_30px_#00ffa326]",
    buttonClass: "bg-[#00ffa3] text-[#05070a] font-black",
    buttonTextClass: "text-[#05070a]",
  },
  {
    id: "hunter",
    name: "HUNTER",
    subtitle: "pricing.ideal_beginners",
    accountSize: "$5,000",
    price: "$69",
    featured: false,
    borderClass: "border border-solid border-slate-400",
    buttonClass:
      "bg-[#ffffff0d] border border-solid border-[#ffffff1a] text-white font-bold",
    buttonTextClass: "text-white",
  },
  {
    id: "whale",
    name: "WHALE",
    subtitle: "pricing.ultimate_platform",
    accountSize: "$100,000",
    price: "$699",
    featured: false,
    borderClass: "border border-solid border-gray-500",
    buttonClass:
      "bg-[#ffffff0d] border border-solid border-[#ffffff1a] text-white font-bold",
    buttonTextClass: "text-white",
  },
];

export const ChallengePricingSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("50K");
  const { t } = useTranslation();

  const planSteps = [
    { label: t("pricing.step1_label"), value: t("pricing.step1_value"), highlight: false },
    { label: t("pricing.step2_label"), value: t("pricing.step2_value"), highlight: false },
    { label: t("pricing.step3_label"), value: t("pricing.step3_value"), highlight: true },
  ];

  return (
    <section className="flex w-full flex-col items-center gap-10 px-4 py-0 sm:px-6 lg:gap-16 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-center w-full">
          <h2 className="[font-family:'Inter',Helvetica] text-center text-3xl font-extrabold leading-tight tracking-[0] text-white sm:text-4xl sm:leading-10">
            {t("pricing.title")}
          </h2>
        </div>

        <div className="flex flex-col items-center pb-4 w-full">
          <p className="[font-family:'Inter',Helvetica] text-center text-base font-normal leading-6 tracking-[0] text-gray-400">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Account size tabs */}
        <div className="inline-flex w-full items-start overflow-x-auto rounded-2xl border border-solid border-[#1e262f] bg-[#0b0f14] p-1 sm:w-auto">
          {accountSizeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex min-w-[72px] flex-col items-center justify-center rounded-xl px-5 py-3 transition-colors sm:px-6 ${
                activeTab === tab ? "bg-[#00ffa3]" : "bg-transparent"
              }`}
            >
              <span
                className={`[font-family:'Inter',Helvetica] font-bold text-sm text-center tracking-[0] leading-5 whitespace-nowrap ${
                  activeTab === tab ? "text-[#05070a]" : "text-gray-400"
                }`}
              >
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative w-full h-fit flex flex-col items-start justify-between p-8 bg-[#0b0f14] rounded-3xl ${plan.borderClass}`}
          >
            {/* MOST POPULAR badge for featured plan */}
            {plan.featured && (
              <div className="flex items-center justify-center px-[16.8px] py-[4.2px] absolute top-[-15px] left-1/2 -translate-x-1/2 bg-[#00ffa3] rounded-full whitespace-nowrap">
                <span className="[font-family:'Inter',Helvetica] font-black text-[#05070a] text-[12.6px] tracking-[0] leading-[16.8px] whitespace-nowrap">
                  {t("pricing.most_popular")}
                </span>
              </div>
            )}

            {/* Plan header */}
            <div className="flex flex-col items-start pt-0 pb-6 px-0 w-full">
              <div className="flex items-start justify-between w-full">
                {/* Plan name and subtitle */}
                <div className="inline-flex flex-col items-start">
                  <span
                    className={`[font-family:'Inter',Helvetica] font-black text-[#00ffa3] tracking-[-1.20px] leading-8 whitespace-nowrap ${
                      plan.featured
                        ? "text-[25.2px] leading-[33.6px] tracking-[-1.26px]"
                        : "text-2xl"
                    }`}
                  >
                    {plan.name}
                  </span>
                  <span
                    className={`[font-family:'Inter',Helvetica] font-normal text-gray-500 tracking-[0] whitespace-nowrap ${
                      plan.featured
                        ? "text-[14.7px] leading-[21px]"
                        : "text-sm leading-5"
                    }`}
                  >
                    {t(plan.subtitle)}
                  </span>
                </div>

                {/* Account size */}
                <div className="inline-flex flex-col items-end">
                  <span
                    className={`[font-family:'Inter',Helvetica] font-bold text-gray-500 text-right tracking-[0] whitespace-nowrap ${
                      plan.featured
                        ? "text-[12.6px] leading-[16.8px]"
                        : "text-xs leading-4"
                    }`}
                  >
                    {t("pricing.account_size")}
                  </span>
                  <span
                    className={`[font-family:'Inter',Helvetica] font-black text-white text-right tracking-[0] whitespace-nowrap ${
                      plan.featured
                        ? "text-[25.2px] leading-[33.6px]"
                        : "text-2xl leading-8"
                    }`}
                  >
                    {plan.accountSize}
                  </span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col items-start pt-0 pb-8 px-0 w-full">
              <div className="flex flex-col items-start gap-4 w-full">
                {planSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between gap-2 border-b border-solid border-[#ffffff0d] px-0 py-2"
                  >
                    <span
                      className={`[font-family:'Inter',Helvetica] font-normal text-gray-400 tracking-[0] ${
                        plan.featured
                          ? "text-[14.7px] leading-[21px]"
                          : "text-sm leading-5"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`[font-family:'Inter',Helvetica] text-right font-bold tracking-[0] ${
                        step.highlight ? "text-[#00ffa3]" : "text-white"
                      } ${plan.featured ? "text-[14.7px] leading-[21px]" : "text-sm leading-5"}`}
                    >
                      {step.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex flex-col items-start gap-6 w-full">
              {/* Price row */}
              <div className="flex items-baseline gap-2 w-full">
                <span
                  className={`[font-family:'Inter',Helvetica] font-black text-white tracking-[0] whitespace-nowrap ${
                    plan.featured
                      ? "text-[31.5px] leading-[37.8px]"
                      : "text-3xl leading-9"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`[font-family:'Inter',Helvetica] font-medium text-gray-500 tracking-[0] whitespace-nowrap ${
                    plan.featured
                      ? "text-[14.7px] leading-[21px]"
                      : "text-sm leading-5"
                  }`}
                >
                  {t("pricing.one_time_fee")}
                </span>
              </div>

              {/* CTA Button */}
              <button
                className={`flex justify-center items-center w-full py-4 rounded-xl cursor-pointer transition-opacity hover:opacity-90 ${plan.buttonClass}`}
              >
                <span
                  className={`[font-family:'Inter',Helvetica] text-base text-center tracking-[0] leading-6 whitespace-nowrap ${
                    plan.featured
                      ? "font-black text-[#05070a] text-[16.8px] leading-[25.2px]"
                      : "font-bold text-white"
                  }`}
                >
                  {t("pricing.start_now")}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
