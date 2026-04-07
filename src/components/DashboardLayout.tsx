import {
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  User,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, type PropsWithChildren } from "react";
import { useAuth } from "../lib/auth";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <main className="min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">
      {/* ═══ Top header bar ═══ */}
      <header className="sticky top-0 z-50 flex h-16 2xl:h-20 items-center justify-between border-b border-[#0f2f35]/60 bg-[#05070A]/95 px-4 sm:px-6 2xl:px-10 backdrop-blur-md">
        {/* Left: hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-300 hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="UPDOWNX" className="h-8 2xl:h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Language */}
          <button className="flex items-center gap-1 text-sm 2xl:text-base text-[#89a4ad] transition-colors hover:text-white">
            <Globe size={14} />
            EN
            <ChevronDown size={12} />
          </button>

          {/* Notifications */}
          <button className="relative text-[#89a4ad] transition-colors hover:text-white">
            <Bell size={18} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00FFA3]" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2.5 rounded-full pl-2 pr-1 py-1 transition-colors hover:bg-[#0d1a24]"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <span className="text-sm font-medium text-[#00FFA3]">
                {user?.name ?? "Trader"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00FFA3] to-[#0ea5e9] text-xs font-bold text-black">
                {(user?.name ?? "T").split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 animate-[fadeIn_0.15s_ease] rounded-2xl border border-[#184049] bg-[#08141c]/95 p-2 shadow-xl backdrop-blur-md">
                <Link
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#c0d4dc] transition-colors hover:bg-[#0d212b] hover:text-white"
                  to="/accounts"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={14} /> Profile
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#c0d4dc] transition-colors hover:bg-[#0d212b] hover:text-white"
                  to="/payments"
                  onClick={() => setMenuOpen(false)}
                >
                  <Wallet size={14} /> Payments
                </Link>
                <div className="my-1.5 h-px bg-[#1a3540]" />
                <button
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#c0d4dc] transition-colors hover:bg-[#0d212b] hover:text-white"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Logout icon */}
          <button
            className="text-[#89a4ad] transition-colors hover:text-red-400"
            onClick={() => {
              logout();
              navigate("/");
            }}
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1920px]">
        {/* ═══ Sidebar ═══ */}
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ═══ Main content ═══ */}
        <section className="relative flex-1">
          {/* Background texture */}
          <img
            src="/images/bg-lines.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <img
            src="/images/bg-lines1.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
          />

          <div className="relative z-10 p-4 sm:p-6 lg:p-8 2xl:p-12">{children}</div>
        </section>
      </div>
    </main>
  );
};


