import { Button } from "../../../../components/ui/button";

const navLinks = [
  { label: "Challenges" },
  { label: "Affiliate" },
  { label: "FAQ" },
  { label: "Blog" },
];

export const TopNavigationSection = (): JSX.Element => {
  return (
    <nav className="w-full h-16 bg-[#0b0f14] border-b border-[#2cf6c3] flex items-center px-[30px]">
      {/* Logo */}
      <div className="flex items-center w-[225px] shrink-0 p-2.5">
        <img
          className="w-full h-[40.29px] object-contain"
          alt="Logo"
          src="/logo.png"
        />
      </div>

      {/* Nav Links - centered */}
      <div className="flex items-center gap-8 flex-1 justify-center">
        {navLinks.map((link) => (
          <button
            key={link.label}
            className="[font-family:'Inter',Helvetica] font-medium text-gray-400 text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Language selector */}
        <div className="inline-flex gap-1 items-center cursor-pointer">
          <span className="[font-family:'Inter',Helvetica] font-bold text-gray-400 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
            EN
          </span>
          <img className="w-4 h-4" alt="Svg" src="/svg-1.svg" />
        </div>

        {/* Login button */}
        <Button
          variant="outline"
          className="h-auto px-5 py-2 rounded-full border border-solid border-[#1e262f] bg-transparent text-white [font-family:'Inter',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap hover:bg-[#1e262f] hover:text-white"
        >
          Login
        </Button>

        {/* Start Challenge button */}
        <Button className="h-auto px-5 py-2 bg-[#00ffa3] rounded-full text-[#05070a] [font-family:'Inter',Helvetica] font-bold text-sm tracking-[0] leading-5 whitespace-nowrap hover:bg-[#00e691] border-none">
          Start Challenge
        </Button>
      </div>
    </nav>
  );
};
