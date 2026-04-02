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
          src="/images/bg-lines.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <img
          src="/images/bg-lines1.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
        />

        <div className="relative z-10">
          <HeroCallToActionSection />
        </div>
      </div>

      <InstitutionalOverviewSection />
      <div id="challenges"><ChallengePricingSection /></div>
      <OnboardingStepsSection />
      <TraderTestimonialsSection />
      <div id="affiliate"><ReferralPromotionSection /></div>
      <div id="faq"><FAQSection /></div>
      <div id="blog"><SupportFooterSection /></div>
    </div>
  );
};
