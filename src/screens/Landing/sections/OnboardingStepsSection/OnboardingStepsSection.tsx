import { useTranslation } from "../../../../lib/i18n";

const stepKeys = [
  { number: "01", titleKey: "onboarding.step1_title", descKey: "onboarding.step1_desc" },
  { number: "02", titleKey: "onboarding.step2_title", descKey: "onboarding.step2_desc" },
  { number: "03", titleKey: "onboarding.step3_title", descKey: "onboarding.step3_desc" },
  { number: "04", titleKey: "onboarding.step4_title", descKey: "onboarding.step4_desc" },
  { number: "05", titleKey: "onboarding.step5_title", descKey: "onboarding.step5_desc" },
];

export const OnboardingStepsSection = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="flex w-full flex-col items-center bg-[#05070a] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex w-full max-w-screen-xl flex-col items-center gap-10 lg:gap-16">
        {/* Section heading */}
        <div className="flex items-center justify-center w-full">
          <h2 className="[font-family:'Inter',Helvetica] text-center text-3xl font-extrabold leading-tight tracking-[0] text-white sm:text-4xl sm:leading-10">
            {t("onboarding.title")}
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-[39px]">
          {stepKeys.map((step) => (
            <div
              key={step.number}
              className="relative w-full h-fit flex flex-col items-start"
            >
              <div className="absolute -top-4 left-0 h-[60px] font-black text-[#ffffff0d] text-6xl leading-[60px] flex items-center [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap select-none">
                {step.number}
              </div>
              <div className="flex flex-col items-start gap-3 pt-8 pb-0 px-0 relative self-stretch w-full">
                <div className="flex flex-col items-start relative self-stretch w-full">
                  <h3 className="relative flex items-center self-stretch [font-family:'Inter',Helvetica] font-bold text-white text-xl tracking-[0] leading-7">
                    {t(step.titleKey)}
                  </h3>
                </div>
                <div className="flex flex-col items-start relative self-stretch w-full">
                  <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
