import { useState } from "react";

const navItems = [
  { value: "trader", label: "TRADER" },
  { value: "challenge", label: "CHALLENGE" },
  { value: "will-be-activated", label: "WILL BE ACTIVATED" },
  { value: "failed", label: "FAILED" },
];

export const NavAccountsSubsection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("challenge");

  return (
    <div className="relative flex w-full items-center justify-between px-3 sm:px-8 lg:px-16 py-3 bg-[#05070a] rounded-xl before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none overflow-x-auto">
      <div className="flex w-full items-center justify-between gap-1 sm:gap-2 min-w-max">
        {navItems.map((item) => {
          const isOn = activeTab === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`flex h-[42px] sm:h-[46px] items-center justify-center gap-2.5 rounded-xl px-3 sm:px-5 transition-colors whitespace-nowrap [font-family:'Inter',Helvetica] text-xs sm:text-sm tracking-[0.35px] leading-5 ${isOn
                ? "bg-[#00ffa3] text-[#0b0f14] font-semibold"
                : "bg-transparent text-white font-medium hover:bg-[#00ffa3]/10"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};