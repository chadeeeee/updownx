import { useState } from "react";
import { Button } from "../../../../components/ui/button";

const navItems = [
  {
    icon: "/svg/wallet.svg",
    alt: "Icon wallet",
    label: "Accounts",
  },
  {
    icon: "/svg/money.svg",
    alt: "Icon cash",
    label: "Payments",
  },
  {
    icon: "/svg/withdrawal.svg",
    alt: "Icon withdrawals",
    label: "Withdrawals",
  },
  {
    icon: "/svg/faq.svg",
    alt: "Icon faq",
    label: "Help",
  },
];

export const ChallengeSidebarNavigationSection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState<string>("New Challenge");

  return (
    <nav className="flex flex-col w-[269px] min-h-full items-center justify-between px-0 py-[43px] bg-[#05070a]">
      <div className="flex flex-col w-[210px] items-start gap-[5px]">
        <button
          onClick={() => setActiveItem("New Challenge")}
          className="w-[210px] gap-1.5 pl-[30px] pr-4 py-2 flex-[0_0_auto] rounded-xl flex items-center cursor-pointer border-none outline-none bg-[#01ffa3]"
        >
          <img
            className="w-[20px] h-[20px] flex-shrink-0"
            alt="Icon rocket"
            src="/svg/rocket.svg"
          />
          <span className="[font-family:'Inter',Helvetica] font-semibold text-[13.2px] tracking-[0] leading-5 whitespace-nowrap text-[#05070a]">
            New Challenge
          </span>
        </button>

        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          const isHelp = item.label === "Help";
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`flex w-[210px] items-center gap-3 px-4 py-3 flex-[0_0_auto] rounded-xl border-none outline-none cursor-pointer transition-all ${
                isActive ? "bg-[#00FFA3] shadow-[0_0_16px_rgba(0,255,163,0.25)]" : "bg-transparent hover:bg-white/5"
              }`}
            >
              {isHelp ? (
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <img
                    className={`w-[30px] h-[30px] max-w-none ml-[-3px] ${isActive ? "brightness-0" : ""}`}
                    alt={item.alt}
                    src={item.icon}
                  />
                </div>
              ) : (
                <img
                  className={`w-[20px] h-[20px] flex-shrink-0 ${isActive ? "brightness-0" : ""}`}
                  alt={item.alt}
                  src={item.icon}
                />
              )}
              <span
                className={`[font-family:'Inter',Helvetica] text-[14px] tracking-[0] leading-5 whitespace-nowrap ${
                  isActive ? "font-semibold text-[#021018]" : "font-medium text-gray-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="self-stretch w-full px-[23px]">
        <div className="relative w-full h-[90px] rounded-xl bg-[linear-gradient(211deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
          <div className="absolute top-[17px] left-[17px] flex items-center [font-family:'Inter',Helvetica] font-normal text-white text-[11.3px] tracking-[0] leading-4">
            Need assistance?
          </div>

          <Button className="absolute top-[41px] left-1/2 -translate-x-1/2 w-[173px] h-[33px] bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl [font-family:'Inter',Helvetica] font-semibold text-[#0b0f14] text-[11.1px] text-center tracking-[0] leading-4 whitespace-nowrap border-none">
            Contact Support
          </Button>
        </div>
      </div>
    </nav>
  );
};
