import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const HeaderUserControls = (): JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name ?? "Trader";
  const initials = getInitials(displayName);

  return (
    <div className="inline-flex items-center gap-3">
      <LanguageSwitcher />

      <button
        className="relative flex items-center justify-center bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
        aria-label="Notifications"
      >
        <img className="h-[18px] w-[18px]" alt="Notifications" src="/svg/bell.svg" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00FFA3]" />
      </button>

      <Link to="/accounts" className="inline-flex items-center gap-3">
        <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-[11.4px] text-right tracking-[-0.40px] leading-4 whitespace-nowrap">
          {displayName}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ffa3]">
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#0b0f14] text-xs tracking-[0] leading-4 whitespace-nowrap">
            {initials}
          </span>
        </div>
      </Link>

      <button
        className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
        onClick={() => {
          logout();
          navigate("/");
        }}
        aria-label="Log out"
      >
        <img className="w-[18px] h-[16px]" alt="Log out" src="/svg/button-log-out.svg" />
      </button>
    </div>
  );
};
