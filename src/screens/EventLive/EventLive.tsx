import { AccountPlanTierGridSection } from "./sections/AccountPlanTierGridSection";
import { EventPromotionHeroSection } from "./sections/EventPromotionHeroSection";

export const EventLive = (): JSX.Element => {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070a]">
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

      </div>

      <div className="flex flex-row flex-1 relative w-full h-full min-w-0">
        <img className="hidden lg:block w-px self-stretch" alt="Divider" src="/vector-6.svg" />

        <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out z-10 w-full">
          <EventPromotionHeroSection />
          <AccountPlanTierGridSection />
        </div>

      </div>
    </>
  );
};
