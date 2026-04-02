import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Stat cards data
const statCards = [
  {
    icon: "/svg/container-1.svg",
    title: "160+ Assets",
    subtitle: "Crypto, Stocks, Forex",
  },
  {
    icon: "/svg/container-2.svg",
    title: "24/7 Support",
    subtitle: "Always here to help",
  },
  {
    icon: "/svg/container-3.svg",
    title: "80% Profit Share",
    subtitle: "Industry leading payouts",
  },
  {
    icon: "/svg/container-4.svg",
    title: "5x Leverage",
    subtitle: "Amplify your trades",
  },
];

export const HeroCallToActionSection = (): JSX.Element => {
  return (
    <section className="relative w-full min-h-[944px] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-full h-full top-0 left-0 flex justify-between pointer-events-none">
        <div className="mt-[-94.4px] w-[500px] h-[500px] ml-36 bg-[#00ffa31a] rounded-full blur-[60px]" />
        <div className="self-end mb-[-94.4px] w-[500px] h-[500px] mr-36 bg-[#2cf6c31a] rounded-full blur-[60px]" />
      </div>

      {/* Main content */}
      <div className="relative w-full flex flex-col items-center gap-8 pt-32 px-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffffff0d] rounded-full border border-solid border-[#ffffff1a]">
          <div className="w-2 h-2 bg-[#00ffa3] rounded-full flex-shrink-0" />
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#2cf6c3] text-xs text-center tracking-[1.20px] leading-4 whitespace-nowrap">
            REVOLUTIONIZING CRYPTO TRADING
          </span>
        </div>

        {/* Headline + subtitle + CTA */}
        <div className="flex flex-col items-center gap-12 w-full max-w-[1216px]">
          {/* Headline + subtitle */}
          <div className="flex flex-col items-center gap-4 w-full max-w-[896px]">
            <div className="flex flex-col items-center px-5">
              <h1 className="[font-family:'Inter',Helvetica] font-black text-white text-7xl text-center tracking-normal leading-[1.1] whitespace-nowrap uppercase">
                TRADE PROFITABLY
              </h1>
              <div className="[font-family:'Inter',Helvetica] font-black text-transparent text-7xl text-center tracking-normal leading-[1.1] uppercase">
                <span className="text-white">WITHOUT </span>
                <span className="text-[#00ffa3]">
                  RISKING
                </span>
                <span className="text-white">
                  {" "}
                  YOUR
                  <br />
                  CAPITAL
                </span>
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-2.5">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-xl text-center tracking-[0] leading-7">
                Trade over 160+ crypto assets with up to 1:5 leverage. Prove
                your skills
                <br />
                and manage up to $100,000 of our liquidity.
              </p>
            </div>
          </div>

          {/* CTA buttons row */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* Choose Your Account button */}
            <Button className="h-auto inline-flex flex-col justify-center px-10 py-5 bg-[#00ffa3] rounded-2xl items-center hover:bg-[#00ffa3]/90 border-0">
              <span className="font-black text-[#05070a] text-lg leading-7 [font-family:'Inter',Helvetica] text-center tracking-[0] whitespace-nowrap">
                CHOOSE YOUR ACCOUNT
              </span>
            </Button>

            {/* Trustpilot widget */}
            <div className="inline-flex h-[68px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md py-3 pl-4 pr-6">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-[#05070a]"
                  src="/images/user-1.png"
                  alt="user"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-[#05070a]"
                  src="/images/user-2.png"
                  alt="user"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-[#05070a]"
                  src="/images/user-3.png"
                  alt="user"
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="#FFB800">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.175 0l-3.367 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs font-normal text-[#89a4ad]">
                  <span className="font-bold text-white">Trustpilot 4.9/5 </span> Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="relative flex h-[140px] flex-col items-center justify-center gap-1 rounded-[16px] 
                       border border-white/5 
                       bg-white/[0.02] 
                       backdrop-blur-xl 
                       p-[25px] 
                       transition-all duration-300 
                       hover:bg-white/[0.05] hover:border-[#00ffa3]/20"
            >
              <CardContent className="flex flex-col items-center justify-center p-0 w-full h-full">
                {/* Іконка */}
                <div className="absolute top-[22px] left-[24px]">
                  <img className="h-6 w-6" alt="Icon" src={card.icon} />
                </div>

                <div className="flex flex-col items-center mt-2">
                  <span className="text-center font-sans text-xl font-bold leading-7 text-white tracking-tight">
                    {card.title}
                  </span>
                  <span className="text-cente r font-sans text-sm font-normal leading-5 text-gray-500 mt-1">
                    {card.subtitle}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
