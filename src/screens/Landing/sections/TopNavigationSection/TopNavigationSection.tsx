import { Button } from "../../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../lib/auth";

const navLinks = [
  { label: "Challenges", href: "#challenges" },
  { label: "Affiliate", href: "#affiliate" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#blog" },
];

export const TopNavigationSection = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full h-16 bg-[#0b0f14] border-b border-[#2cf6c3] flex items-center px-[30px]">
      {/* Logo */}
      <Link to="/" className="flex items-center w-[225px] shrink-0 p-2.5">
        <img
          className="w-full h-[40.29px] object-contain"
          alt="Logo"
          src="/images/logo.png"
        />
      </Link>

      {/* Nav Links - centered */}
      <div className="flex items-center gap-8 flex-1 justify-center">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="[font-family:'Inter',Helvetica] font-medium text-gray-400 text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-[#00ffa3] transition-colors cursor-pointer"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Language selector */}
        <div className="inline-flex gap-1 items-center cursor-pointer">
          <span className="[font-family:'Inter',Helvetica] font-bold text-gray-400 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
            EN
          </span>
          <img className="w-4 h-4" alt="Svg" src="/svg/arrow.svg" />
        </div>

        {/* Login button */}
        {user ? (
          <button
            className="h-auto rounded-full border border-solid border-[#1e262f] bg-transparent px-5 py-2 text-sm text-[#00ffa3] hover:bg-[#1e262f]"
            onClick={() => navigate("/accounts")}
          >
            {user.name}
          </button>
        ) : (
          <>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-full border border-solid border-[#1e262f] bg-transparent px-5 py-2 text-sm font-normal leading-5 whitespace-nowrap text-white hover:bg-[#1e262f] hover:text-white"
            >
              <Link to="/login">Login</Link>
            </Button>
          </>
        )}

        {/* Start Challenge button */}
        <Button
          asChild
          className="h-auto rounded-full border-none bg-[#00ffa3] px-5 py-2 text-sm font-bold leading-5 whitespace-nowrap text-[#05070a] hover:bg-[#00e691]"
        >
          <Link to={user ? "/challenge" : "/login"}>Start Challenge</Link>
        </Button>
      </div>
    </nav>
  );
};
