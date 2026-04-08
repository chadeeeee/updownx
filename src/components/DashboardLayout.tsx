import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, type PropsWithChildren } from "react";
import { HeaderUserControls } from "./HeaderUserControls";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#05070A] font-['Inter',sans-serif] text-white">
      {/* ═══ Top header bar ═══ */}
      <header className="sticky top-0 z-50 flex h-16 2xl:h-20 items-center justify-between border-b border-[#2cf6c3] bg-[#05070A]/95 px-4 sm:px-6 2xl:px-10 backdrop-blur-md">
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
        <HeaderUserControls />
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* ═══ Sidebar ═══ */}
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ═══ Main content ═══ */}
        <section className="relative flex-1 min-w-0 overflow-x-hidden">
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

          <div className="relative z-10 min-w-0 p-4 sm:p-6 lg:p-8 2xl:p-12">{children}</div>
        </section>
      </div>
    </main>
  );
};


