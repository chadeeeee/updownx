import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "../lib/auth";

interface TopBarProps {
  onMenuToggle?: () => void;
  logoSrc?: string;
  avatarSrc?: string;
}

export const TopBar = ({
  onMenuToggle,
  logoSrc = "https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo.png",
  avatarSrc = "https://c.animaapp.com/mnh4g5xzo5XXIf/img/avatar.png",
}: TopBarProps): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full h-16 flex bg-[#0b0f14] border-b border-[#2cf6c3] shrink-0 z-30">
      <div className="flex-1 flex items-center justify-between px-4 sm:px-[30px] py-2.5">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-300 hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-start gap-2.5 p-2.5">
            <img
              className="h-[36px] sm:h-[40.29px] w-auto max-w-[160px] sm:max-w-[225px] object-contain"
              alt="Logo"
              src={logoSrc}
            />
          </div>
        </div>

        {/* Right controls */}
        <div className="inline-flex items-center gap-2 sm:gap-3">
          {/* Language selector */}
          <div className="hidden sm:inline-flex gap-1 items-center cursor-pointer">
            <span className="[font-family:'Inter',Helvetica] font-bold text-gray-300 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
              EN
            </span>
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </div>

          {/* Notification bell */}
          <button
            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white p-0 bg-transparent border-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* User info */}
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:flex [font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-[11.4px] text-right tracking-[-0.40px] leading-4 whitespace-nowrap">
              {user?.name || "Alex Trader"}
            </span>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-solid border-[#00ffa3] overflow-hidden bg-[#0b0f14] flex items-center justify-center shrink-0">
              <img
                src={avatarSrc}
                alt={`${user?.name || "User"} avatar`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[#00ffa3] text-xs font-bold [font-family:'Inter',Helvetica] absolute">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "AT"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white bg-transparent border-none cursor-pointer p-0"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
