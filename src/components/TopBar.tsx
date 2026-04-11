import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderUserControls } from "./HeaderUserControls";

interface TopBarProps {
  onMenuToggle?: () => void;
  logoSrc?: string;
  avatarSrc?: string;
}

export const TopBar = ({
  onMenuToggle,
  logoSrc = "https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo.png",
}: TopBarProps): JSX.Element => {
  return (
    <header data-top-menu className="w-full h-16 2xl:h-20 flex bg-[#0b0f14] border-b border-[#2cf6c3] shrink-0 z-30">
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
          <Link to="/" className="flex flex-col items-start gap-2.5 p-2.5">
            <img
              className="h-[36px] sm:h-[40.29px] w-auto max-w-[160px] sm:max-w-[225px] object-contain"
              alt="Logo"
              src={logoSrc}
            />
          </Link>
        </div>

        {/* Right controls */}
        <HeaderUserControls />
      </div>
    </header>
  );
};
