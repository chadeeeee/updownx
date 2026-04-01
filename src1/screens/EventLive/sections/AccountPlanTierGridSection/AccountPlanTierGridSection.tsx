import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "starter",
    name: "STARTER",
    balance: "$799",
    price: "$799",
    isPopular: false,
    nameColor: "text-slate-400",
    bottomNameColor: "text-slate-400",
    cardBorderClass: "border-[#ffffff0d]",
    cardShadowClass: "",
    bottomBorderClass: "border-[#ffffff0d]",
    bottomBgClass: "bg-[#0b0f1466]",
  },
  {
    id: "boost",
    name: "BOOST",
    balance: "$5,000",
    price: "$49",
    isPopular: false,
    nameColor: "text-slate-400",
    bottomNameColor: "text-slate-400",
    cardBorderClass: "border-[#ffffff0d]",
    cardShadowClass: "",
    bottomBorderClass: "border-[#ffffff0d]",
    bottomBgClass: "bg-[#0b0f1466]",
  },
  {
    id: "pro",
    name: "PRO",
    balance: "$25,000",
    price: "$199",
    isPopular: true,
    nameColor: "text-[#00ffa3]",
    bottomNameColor: "text-[#00ffa3]",
    cardBorderClass: "border-[#00ffa366]",
    cardShadowClass: "shadow-[0px_0px_20px_#00ffa326]",
    bottomBorderClass: "border-[#00ffa333]",
    bottomBgClass: "bg-[#0b0f1499]",
  },
  {
    id: "elite",
    name: "ELITE",
    balance: "$50,000",
    price: "$399",
    isPopular: false,
    nameColor: "text-slate-400",
    bottomNameColor: "text-slate-400",
    cardBorderClass: "border-[#ffffff0d]",
    cardShadowClass: "",
    bottomBorderClass: "border-[#ffffff0d]",
    bottomBgClass: "bg-[#0b0f1466]",
  },
  {
    id: "legend",
    name: "LEGEND",
    balance: "$100,000",
    price: "$699",
    isPopular: false,
    nameColor: "text-slate-400",
    bottomNameColor: "text-slate-400",
    cardBorderClass: "border-[#ffffff0d]",
    cardShadowClass: "",
    bottomBorderClass: "border-[#ffffff0d]",
    bottomBgClass: "bg-[#0b0f1466]",
  },
];

const features = [
  "2 Step Assessment",
  "Unlimited Trading",
  "Up to 80% Profit Split",
  "Challenge Fee",
  "160+ Cryptos",
  "1:5 Leverage",
];

export const AccountPlanTierGridSection = (): JSX.Element => {
  const navigate = useNavigate();

  const handleCryptoPayment = (planId: string) => {
    navigate("/checkout");
  };

  return (
    <div className="flex w-full items-center gap-2.5 pl-2 pr-0 py-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex flex-col flex-1 min-w-0 h-[525px] items-start gap-4"
        >
          <div
            className={`relative self-stretch w-full h-[365px] bg-[#0b0f14] rounded-xl border border-solid ${plan.cardBorderClass} ${plan.cardShadowClass} backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]`}
          >
            {plan.isPopular && (
              <div className="flex flex-col items-start px-3 py-1 absolute top-[-11px] left-1/2 -translate-x-1/2 bg-[#00ffa3] rounded-full z-10">
                <span className="[font-family:'Public_Sans',Helvetica] font-black text-[#05070a] text-[10px] tracking-[-0.50px] leading-[15px] whitespace-nowrap">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="flex flex-col w-[calc(100%_-_50px)] items-start absolute top-[25px] left-[25px]">
              <span
                className={`[font-family:'Public_Sans',Helvetica] font-bold ${plan.nameColor} text-xs tracking-[1.20px] leading-4 whitespace-nowrap`}
              >
                {plan.name}
              </span>
            </div>

            <div className="flex flex-col w-[calc(100%_-_50px)] items-start absolute top-[49px] left-[25px]">
              <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl tracking-[0] leading-9 whitespace-nowrap">
                {plan.balance}
              </span>
            </div>

            <div className="flex flex-col w-[calc(100%_-_50px)] items-start absolute top-[89px] left-[25px]">
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
                ACCOUNT BALANCE
              </span>
            </div>

            <div className="flex flex-col w-[calc(100%_-_50px)] items-start gap-3 absolute top-32 left-[25px]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 self-stretch w-full"
                >
                  <img
                    className="flex-shrink-0"
                    alt="Check"
                    src="/container.svg"
                  />
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-300 text-xs tracking-[0] leading-4 whitespace-nowrap">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${plan.bottomBgClass} ${plan.bottomBorderClass} flex flex-col items-start gap-4 p-4 self-stretch w-full rounded-xl border border-solid backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]`}
          >
            <div className="flex items-center justify-between self-stretch w-full">
              <span
                className={`[font-family:'Public_Sans',Helvetica] font-bold ${plan.bottomNameColor} text-[10px] tracking-[0] leading-[15px] whitespace-nowrap`}
              >
                {plan.name}
              </span>
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                {plan.price}
              </span>
            </div>

            <div className="flex flex-col items-start gap-2 self-stretch w-full">
              <button
                onClick={() => handleCryptoPayment(plan.id)}
                className="relative flex items-center justify-center px-0 py-2 self-stretch w-full bg-[#00ffa3] hover:bg-[#00e691] rounded-lg overflow-hidden transition-colors cursor-pointer border-none"
              >
                <div className="absolute inset-0 bg-[#ffffff01] rounded-lg shadow-[0px_4px_6px_-4px_#00ffa31a,0px_10px_15px_-3px_#00ffa31a]" />
                <span className="relative [font-family:'Public_Sans',Helvetica] font-black text-[#05070a] text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                  Crypto Payment
                </span>
              </button>

              <button className="flex items-center justify-center px-0 py-2 self-stretch w-full rounded-lg border border-solid border-[#ffffff1a] bg-transparent hover:bg-white/5 transition-colors cursor-pointer">
                <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                  PIX
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
