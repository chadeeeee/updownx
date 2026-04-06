import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const navItems = [
  {
    icon: "/svg/rocket.svg",
    alt: "Icon rocket",
    label: "New Challenge",
    route: "/challenge",
  },
  {
    icon: "/svg/wallet.svg",
    alt: "Icon wallet",
    label: "Accounts",
    route: "/accounts",
  },
  {
    icon: "/svg/money.svg",
    alt: "Icon cash",
    label: "Payments",
    route: "/payments",
  },
  {
    icon: "/svg/withdrawal.svg",
    alt: "Icon withdrawals",
    label: "Withdrawals",
    route: "/withdrawals",
  },
  {
    icon: "/svg/faq.svg",
    alt: "Icon faq",
    label: "Help",
    route: "/help",
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && onClose && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`flex flex-col w-[269px] min-h-full items-start justify-between pl-6 pr-0 py-[43px] bg-[#05070a] transition-transform duration-300 z-40 fixed lg:sticky top-0 left-0 lg:left-auto lg:h-screen lg:overflow-y-auto ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col w-[210px] items-start gap-[5px]">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.route) || (item.route === "/challenge" && location.pathname === "/event-live") || (item.route === "/accounts" && location.pathname === "/control-panel");
            const isHelp = item.label === "Help";
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.route);
                  if (onClose) onClose();
                }}
                className={`flex w-[210px] items-center gap-1.5 py-2 flex-[0_0_auto] rounded-xl border-none outline-none cursor-pointer transition-all duration-200 px-4 ${
                  isActive ? "bg-[#01ffa3]" : "bg-transparent hover:bg-white/5"
                }`}
              >
                {isHelp ? (
                  <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0 relative">
                    <img
                      className={`w-[26px] h-[26px] max-w-none absolute ${isActive ? "brightness-0" : ""}`}
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
                  className={`[font-family:'Inter',Helvetica] text-[13.2px] tracking-[0] leading-5 whitespace-nowrap transition-colors ${
                    isActive ? "font-semibold text-[#05070a]" : "font-normal text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

      </aside>

      {/* Need assistance — fixed to viewport bottom-left, aligned with sidebar */}
      <div className="fixed bottom-[30px] left-[30px] w-[210px] z-50 hidden lg:block">
        <div className="relative w-full h-[90px] rounded-xl bg-[linear-gradient(211deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
          <div className="absolute top-[17px] left-[17px] flex items-center [font-family:'Inter',Helvetica] font-normal text-white text-[11.3px] tracking-[0] leading-4">
            Need assistance?
          </div>
          <Button 
              onClick={() => navigate('/support')}
              className="absolute top-[41px] left-1/2 -translate-x-1/2 w-[173px] h-[33px] bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl [font-family:'Inter',Helvetica] font-semibold text-[#0b0f14] text-[11.1px] text-center tracking-[0] leading-4 whitespace-nowrap border-none">
            Contact Support
          </Button>
        </div>
      </div>
    </>
  );
};