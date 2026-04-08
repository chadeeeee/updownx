import { Link } from "react-router-dom";
import { HeaderUserControls } from "../../../../components/HeaderUserControls";

export const PrimaryNavigationSection = (): JSX.Element => {
  return (
    <nav className="w-full h-16 flex flex-row items-center justify-between px-[30px] py-2.5 bg-[#0b0f14] border-b border-[#2cf6c3]">
      {/* Logo section */}
      <div className="flex items-center">
        <Link to="/" className="flex flex-col w-[225px] items-start gap-2.5 p-2.5">
          <img
            className="self-stretch w-full h-[40.29px] object-contain"
            alt="Logo"
            src="/images/logo.png"
          />
        </Link>
      </div>

      {/* Right side controls */}
      <HeaderUserControls />
    </nav>
  );
};
