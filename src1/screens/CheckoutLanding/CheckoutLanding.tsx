import { CheckoutDetailSection } from "./sections/CheckoutDetailSection/CheckoutDetailSection";
import { LandingSlidebarSubsection } from "./sections/LandingSlidebarSubsection";
import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection";

export const CheckoutLanding = (): JSX.Element => {
  return (
    <div className="bg-[linear-gradient(0deg,rgba(5,7,10,1)_0%,rgba(5,7,10,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-full min-w-[1440px] min-h-[1024px] relative overflow-hidden">
      {/* Background images */}
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


      {/* Primary Navigation at the top */}
      <PrimaryNavigationSection />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-row w-full relative">
        {/* Left sidebar */}
        <LandingSlidebarSubsection />

        {/* Right content area */}
        <div className="flex flex-col flex-1 relative">
          {/* Checkout header with breadcrumb */}
          <header className="flex flex-col items-start gap-2 px-8 pt-[36px] pb-2 bg-transparent">
            {/* Title */}
            <div className="w-full h-9 flex items-center">
              <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl tracking-[-0.75px] leading-9">
                CHECKOUT
              </span>
            </div>

            {/* Breadcrumb */}
            <div className="flex flex-row items-center gap-0 h-5">
              <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                New Challenge
              </span>
              <img
                className="w-3 h-4 mx-[8px]"
                alt="Container"
                src="/container-2.svg"
              />
              <span className="[font-family:'Public_Sans',Helvetica] font-normal text-[#00ffa3] text-sm tracking-[0] leading-5 whitespace-nowrap">
                Order Confirmation
              </span>
            </div>
          </header>

          {/* Checkout detail section */}
          <CheckoutDetailSection />
        </div>
      </div>

      {/* Vertical separator line */}
      <img
        className="fixed top-20 left-[270px] w-px h-[994px] pointer-events-none"
        alt="Vector"
        src="/vector-6.svg"
      />
    </div>
  );
};
