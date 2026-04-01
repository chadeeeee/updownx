import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Дані карток (іконки залишив як шлях, щоб не ламалося)
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
    <div className="flex flex-col items-center gap-12 w-full max-w-[1216px] mx-auto py-10">
      
      {/* 1. TRUSTPILOT WIDGET (Прозорий) */}
      <div className="inline-flex h-[68px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md py-3 pl-4 pr-6">
        <div className="flex -space-x-3 overflow-hidden">
          <div className="h-10 w-10 rounded-full bg-gray-800 border-2 border-[#05070a]" />
          <div className="h-10 w-10 rounded-full bg-gray-700 border-2 border-[#05070a]" />
          <div className="h-10 w-10 rounded-full bg-gray-600 border-2 border-[#05070a]" />
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

      {/* 2. GRID OF CARDS (Прозорі) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className="flex h-[140px] flex-col items-start justify-center gap-1 rounded-[16px] 
                       border border-white/5 
                       bg-white/[0.02] 
                       backdrop-blur-xl 
                       p-[25px] 
                       transition-all duration-300 
                       hover:bg-white/[0.05] hover:border-[#00ffa3]/20"
          >
            <CardContent className="flex flex-col items-start gap-1 p-0 w-full">
              {/* Іконка */}
              <img className="h-7 w-7 mb-2 opacity-70" alt="Icon" src={card.icon} />
              
              <div className="flex flex-col items-start">
                <span className="font-sans text-xl font-bold leading-7 text-white tracking-tight">
                  {card.title}
                </span>
                <span className="font-sans text-sm font-normal leading-5 text-gray-500">
                  {card.subtitle}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};