import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

// Navigation menu items data
const navItems = [
  {
    id: "new-challenge",
    label: "New Challenge",
    icon: "/svg/rocket.svg",
    alt: "Icon rocket",
    active: true,
    route: "/challenge",
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: "/svg/wallet.svg",
    alt: "Icon wallet",
    active: false,
    route: "/accounts",
  },
  {
    id: "payments",
    label: "Payments",
    icon: "/svg/money.svg",
    alt: "Icon cash",
    active: false,
    route: "/payments",
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: "/svg/withdrawal.svg",
    alt: "Icon withdrawals",
    active: false,
    route: "#",
  },
  {
    id: "help",
    label: "Help",
    icon: "/svg/faq.svg",
    alt: "Icon faq",
    active: false,
    route: "#",
  },
];

export const LandingSlidebarSubsection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState("new-challenge");
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col w-[269px] min-h-screen items-center justify-between px-0 py-[43px] bg-[#05070a]">
      {/* Navigation menu items */}
      <div className="flex flex-col w-[210px] items-start gap-[5px]">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const isNewChallenge = item.id === "new-challenge";
          const isHelp = item.id === "help";
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                if (item.route && item.route !== "#") navigate(item.route);
              }}
              className={`flex w-[210px] items-center gap-1.5 py-2 rounded-xl transition-colors ${
                isNewChallenge
                  ? "bg-[#01ffa3] pl-[30px] pr-4"
                  : isActive
                  ? "bg-white/10 px-4"
                  : "px-4 bg-transparent hover:bg-white/5"
              }`}
            >
              {isHelp ? (
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <img
                    className="w-[30px] h-[30px] max-w-none ml-[-3px]"
                    alt={item.alt}
                    src={item.icon}
                  />
                </div>
              ) : (
                <img
                  className="w-[20px] h-[20px] flex-shrink-0"
                  alt={item.alt}
                  src={item.icon}
                />
              )}
              <span
                className={`[font-family:'Inter',Helvetica] text-[13.2px] tracking-[0] leading-5 whitespace-nowrap ${
                  isNewChallenge
                    ? "font-semibold text-[#05070a]"
                    : isActive
                    ? "font-semibold text-white"
                    : "font-normal text-gray-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom assistance card */}
      <div className="self-stretch w-full px-[23px]">
        <div
          className="relative w-full h-[90px] rounded-xl bg-[linear-gradient(211deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]"
          style={{
            border: "1px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "inset 0 0 0 1px rgba(44,246,195,0.3)",
          }}
        >
          {/* "Need assistance?" label */}
          <p className="absolute top-[17px] left-[17px] [font-family:'Inter',Helvetica] font-normal text-white text-[11.3px] tracking-[0] leading-4">
            Need assistance?
          </p>

          {/* Contact Support button */}
          <Button
            className="absolute top-[41px] left-1/2 -translate-x-1/2 w-[173px] h-[33px] bg-[#00ffa3] hover:bg-[#00e691] rounded-xl [font-family:'Inter',Helvetica] font-semibold text-[#0b0f14] text-[11.1px] tracking-[0] leading-4 whitespace-nowrap p-0"
            style={{ minWidth: 0 }}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </nav>
  );
};
