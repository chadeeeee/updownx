import { Link } from "react-router-dom";
import { HeaderUserControls } from "../../../../components/HeaderUserControls";

export const PrimaryNavigationSection = (): JSX.Element => {
  return (
    <header data-top-menu className="sticky top-0 z-50 flex h-16 2xl:h-20 items-center justify-between border-b border-[#2cf6c3] bg-[#05070A]/95 px-4 sm:px-6 2xl:px-10 backdrop-blur-md">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="UPDOWNX" className="h-8 2xl:h-10 w-auto object-contain" />
        </Link>
      </div>

      {/* Right side controls */}
      <HeaderUserControls />
    </header>
  );
};
