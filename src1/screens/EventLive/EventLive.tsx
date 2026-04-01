import { AccountPlanTierGridSection } from "./sections/AccountPlanTierGridSection";
import { ChallengeSidebarNavigationSection } from "./sections/ChallengeSidebarNavigationSection";
import { EventPromotionHeroSection } from "./sections/EventPromotionHeroSection";
import { GlobalHeaderNavigationSection } from "./sections/GlobalHeaderNavigationSection";

export const EventLive = (): JSX.Element => {
  return (
    <div className="bg-[linear-gradient(0deg,rgba(5,7,10,1)_0%,rgba(5,7,10,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-full min-w-[1440px] min-h-[1022px] relative flex flex-col">
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


      <GlobalHeaderNavigationSection />

      <div className="flex flex-row flex-1 relative">
        <ChallengeSidebarNavigationSection />

        <img className="w-px self-stretch" alt="Divider" src="/vector-6.svg" />

        <div className="flex flex-col flex-1">
          <EventPromotionHeroSection />
          <AccountPlanTierGridSection />
        </div>
      </div>
    </div>
  );
};
