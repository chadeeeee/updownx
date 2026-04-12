import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { useTranslation } from "../../../../lib/i18n";

const stepKeys = [
  { number: "1", titleKey: "referral.step1_title", descKey: "referral.step1_desc" },
  { number: "2", titleKey: "referral.step2_title", descKey: "referral.step2_desc" },
  { number: "3", titleKey: "referral.step3_title", descKey: "referral.step3_desc" },
];

export const ReferralPromotionSection = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="flex w-full flex-col items-center px-4 py-16 sm:px-6 lg:px-5 lg:py-24">
      <div className="relative flex w-full max-w-[1216px] flex-col items-start overflow-hidden rounded-[28px] border border-solid border-[#00ffa333] bg-[linear-gradient(171deg,rgba(11,15,20,1)_0%,rgba(5,7,10,1)_100%)] p-6 sm:rounded-[40px] sm:p-10 lg:p-16">
      {/* Right-side green glow overlay */}
      <div className="absolute w-[33.28%] h-full top-0 left-[66.64%] bg-[#00ffa30d] blur-[50px] pointer-events-none" />

      <div className="relative flex w-full flex-col gap-8 self-stretch lg:flex-row lg:items-center lg:gap-16">
        {/* Left content */}
        <div className="flex flex-col items-start gap-4 relative flex-1">
          {/* Eyebrow label */}
          <p className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-sm tracking-[1.40px] leading-5 self-stretch">
            {t("referral.label")}
          </p>

          {/* Heading */}
          <h2 className="[font-family:'Inter',Helvetica] self-stretch text-3xl font-black leading-tight tracking-[0] text-white sm:text-5xl sm:leading-[48px]">
            {t("referral.title_line1")}
            <br />
            {t("referral.title_line2")}
            <br />
            {t("referral.title_line3")}
          </h2>

          {/* Description */}
          <div className="pt-2 pb-4 self-stretch">
            <p className="[font-family:'Inter',Helvetica] self-stretch text-base font-normal leading-7 tracking-[0] text-gray-400 sm:text-lg">
              {t("referral.description")}
            </p>
          </div>

          {/* CTA Button */}
          <Button className="h-auto w-full rounded-2xl bg-[#00ffa3] px-6 py-4 text-base font-black leading-6 text-[#05070a] hover:bg-[#00ffa3]/90 [font-family:'Inter',Helvetica] sm:w-auto sm:px-10 sm:py-5 sm:text-lg sm:leading-7">
            {t("referral.button")}
          </Button>
        </div>

        {/* Right steps */}
        <div className="flex flex-col gap-4 flex-1">
          {stepKeys.map((step) => (
            <Card
              key={step.number}
              className="w-full bg-[#ffffff0d] border border-solid border-[#ffffff1a] rounded-2xl shadow-none"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex w-12 h-12 items-center justify-center shrink-0 bg-[#00ffa333] rounded-full">
                  <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-base text-center leading-6">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-0">
                  <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                    {t(step.titleKey)}
                  </span>
                  <span className="[font-family:'Inter',Helvetica] text-sm font-normal leading-5 tracking-[0] text-gray-500">
                    {t(step.descKey)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};
