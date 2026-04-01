import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Stat cards data
const statCards = [
  {
    icon: "/container-4.svg",
    title: "160+ Assets",
    subtitle: "Crypto, Stocks, Forex",
  },
  {
    icon: "/container-6.svg",
    title: "24/7 Support",
    subtitle: "Always here to help",
  },
  {
    icon: "/container-2.svg",
    title: "80% Profit Share",
    subtitle: "Industry leading payouts",
  },
  {
    icon: "/container.svg",
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
              <h1 className="[font-family:'Inter',Helvetica] font-normal text-white text-7xl text-center tracking-[-1.80px] leading-[72px] whitespace-nowrap">
                TRADE PROFITABLY
              </h1>
              <div className="[font-family:'Inter',Helvetica] font-normal text-transparent text-7xl text-center tracking-[-1.80px] leading-[72px]">
                <span className="text-white tracking-[-1.30px]">WITHOUT </span>
                <span className="text-[#00ffa3] tracking-[-1.30px]">
                  RISKING
                </span>
                <span className="text-white tracking-[-1.30px]">
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
            <div className="inline-flex h-[68px] items-center gap-3 p-3 rounded-2xl bg-[#0b0f14] border border-solid border-[#1e262f]">
              <img
                className="flex-shrink-0"
                alt="Container"
                src="/container-5.svg"
              />
              <div className="inline-flex flex-col items-start">
                <img
                  className="self-stretch w-full"
                  alt="Container"
                  src="/container-3.svg"
                />
                <div className="flex flex-col items-start self-stretch w-full">
                  <div className="[font-family:'Inter',Helvetica] font-normal text-transparent text-xs tracking-[0] leading-4 whitespace-nowrap">
                    <span className="font-medium text-white">
                      Trustpilot 4.9/5{" "}
                    </span>
                    <span className="text-gray-500">Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex w-full max-w-[1216px] items-stretch gap-4 pb-8">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col items-start gap-1 p-[25px] flex-1 bg-[#0b0f14] rounded-2xl border border-solid border-[#1e262f]"
            >
              <CardContent className="flex flex-col items-start gap-1 p-0 w-full">
                <img
                  className="self-stretch w-full"
                  alt="Container"
                  src={card.icon}
                />
                <div className="flex flex-col items-center w-full">
                  <span className="[font-family:'Inter',Helvetica] font-bold text-white text-xl text-center tracking-[0] leading-7 whitespace-nowrap">
                    {card.title}
                  </span>
                </div>
                <div className="flex flex-col items-center w-full">
                  <span className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
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
