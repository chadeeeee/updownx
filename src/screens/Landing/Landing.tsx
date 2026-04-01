import { ChallengePricingSection } from "./sections/ChallengePricingSection";
import { FAQSection } from "./sections/FAQSection";
import { HeroCallToActionSection } from "./sections/HeroCallToActionSection";
import { InstitutionalOverviewSection } from "./sections/InstitutionalOverviewSection/InstitutionalOverviewSection";
import { OnboardingStepsSection } from "./sections/OnboardingStepsSection/OnboardingStepsSection";
import { ReferralPromotionSection } from "./sections/ReferralPromotionSection/ReferralPromotionSection";
import { SupportFooterSection } from "./sections/SupportFooterSection";
import { TopNavigationSection } from "./sections/TopNavigationSection";
import { TraderTestimonialsSection } from "./sections/TraderTestimonialsSection";

export const Landing = (): JSX.Element => {
  return (
    <div className="flex flex-col items-stretch relative bg-[linear-gradient(0deg,rgba(5,7,10,1)_0%,rgba(5,7,10,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      {/* Top navigation sits at the very top */}
      <TopNavigationSection />

      {/* Hero section with background images layered behind content */}
      <div className="relative w-full">
        <img
          className="absolute top-0 left-[calc(50%_-_720px)] w-[1440px] h-[944px] bg-blend-screen pointer-events-none"
          alt="Chatgpt image"
          src="/chatgpt-image-13------2026-----00-51-40-1.png"
        />
        <img
          className="absolute top-[2px] left-[calc(50%_-_720px)] w-[1439px] h-[943px] pointer-events-none"
          alt="Chatgpt image"
          src="/chatgpt-image-13------2026-----00-54-43-1.png"
        />
        <div className="relative z-10">
          <HeroCallToActionSection />
        </div>
      </div>

      <InstitutionalOverviewSection />
      <ChallengePricingSection />
      <OnboardingStepsSection />
      <TraderTestimonialsSection />
      <ReferralPromotionSection />
      <FAQSection />
      <SupportFooterSection />
    </div>
  );
};
