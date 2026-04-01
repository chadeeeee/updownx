import { useState } from "react";

// Account size tab options
const accountSizeTabs = ["5K", "10K", "25K", "50K", "100K"];

// Steps data shared across all plans
const planSteps = [
  { label: "Step 1: Challenge", value: "10% Target", highlight: false },
  { label: "Step 2: Verification", value: "5% Target", highlight: false },
  { label: "Step 3: Funded", value: "Earn 80%", highlight: true },
];

// Pricing plans data
const pricingPlans = [
  {
    id: "starter",
    name: "STARTER",
    subtitle: "Ideal for beginners",
    accountSize: "$5,000",
    price: "$79",
    featured: false,
    borderClass: "border border-solid border-slate-400",
    buttonClass:
      "bg-[#ffffff0d] border border-solid border-[#ffffff1a] text-white font-bold",
    buttonTextClass: "text-white",
  },
  {
    id: "pro",
    name: "PRO",
    subtitle: "For serious traders",
    accountSize: "$50,000",
    price: "$349",
    featured: true,
    borderClass:
      "border-2 border-solid border-[#00ffa3] shadow-[0px_0px_30px_#00ffa326]",
    buttonClass: "bg-[#00ffa3] text-[#05070a] font-black",
    buttonTextClass: "text-[#05070a]",
  },
  {
    id: "elite",
    name: "ELITE",
    subtitle: "The ultimate platform",
    accountSize: "$100,000",
    price: "$799",
    featured: false,
    borderClass: "border border-solid border-gray-500",
    buttonClass:
      "bg-[#ffffff0d] border border-solid border-[#ffffff1a] text-white font-bold",
    buttonTextClass: "text-white",
  },
];

export const ChallengePricingSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("5K");

  return (
    <section className="flex flex-col w-full items-center gap-16 px-8 py-0">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-center w-full">
          <h2 className="[font-family:'Inter',Helvetica] font-normal text-white text-4xl leading-10 text-center tracking-[0] whitespace-nowrap">
            Choose Your Challenge
          </h2>
        </div>

        <div className="flex flex-col items-center pb-4 w-full">
          <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-base text-center tracking-[0] leading-6 whitespace-nowrap">
            Select an account size that fits your expertise and trading style.
          </p>
        </div>

        {/* Account size tabs */}
        <div className="inline-flex items-start p-1 bg-[#0b0f14] rounded-2xl overflow-x-auto border border-solid border-[#1e262f]">
          {accountSizeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex flex-col justify-center px-6 py-3 rounded-xl items-center cursor-pointer transition-colors ${
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
                  MOST POPULAR
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
                    {plan.subtitle}
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
                    Account Size
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
                    className="flex items-center justify-between px-0 py-2 w-full border-b border-solid border-[#ffffff0d]"
                  >
                    <span
                      className={`[font-family:'Inter',Helvetica] font-normal text-gray-400 tracking-[0] whitespace-nowrap ${
                        plan.featured
                          ? "text-[14.7px] leading-[21px]"
                          : "text-sm leading-5"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`[font-family:'Inter',Helvetica] font-bold tracking-[0] whitespace-nowrap ${
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
                  One-time fee
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
                  Start Now
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
