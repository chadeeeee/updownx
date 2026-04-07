<<<<<<< HEAD
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ContentSubsection } from "./sections/ContentSubsection/ContentSubsection";
import { DashboardLayout } from "../../components/DashboardLayout";
import { ChevronDown, Menu, X } from "lucide-react";

// Mobile navigation tabs identical to Accounts
const mobileNavTabs = [
  { label: "New challenge", route: "/challenge" },
  { label: "Accounts", route: "/accounts" },
  { label: "Payments", route: "/payments" },
  { label: "Withdrawals", route: "/withdrawals" },
];
=======
import { DashboardLayout } from "../../components/DashboardLayout";
import { ContentSubsection } from "./sections/ContentSubsection";
>>>>>>> origin/master

export const Payments = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isMobileTabActive = (route: string) =>
    location.pathname.startsWith(route);

  const PageContent = () => (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out flex-shrink-0 relative z-10">
      <div className="flex flex-col gap-1">
        <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl sm:text-2xl lg:text-3xl tracking-[-0.5px]">
          Payments
        </h1>
        <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-sm lg:text-base">
          Manage your orders and billing history
        </p>
      </div>

      <div className="w-full">
        <ContentSubsection />
      </div>
    </div>
  );

  return (
<<<<<<< HEAD
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05070A]">
        <img
          className="absolute top-20 left-0 w-full h-full object-cover opacity-50 bg-blend-screen"
          alt=""
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-51-40-1.png"
        />
        <img
          className="absolute top-20 left-0 w-full h-full object-cover opacity-40"
          alt=""
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1-1.png"
        />
      </div>

      {/* ═══ MOBILE LAYOUT (< xl) ═══ */}
      <div className="xl:hidden w-full overflow-x-clip flex flex-col min-h-screen font-['Inter',sans-serif] text-white relative z-10">
        
        {/* Mirror Accounts Header */}
        <header className="sticky top-0 z-50 flex h-14 md:h-16 lg:h-20 items-center justify-between bg-[#05070A]/95 px-3 backdrop-blur-md min-[375px]:px-4 md:px-6 lg:px-10 border-b border-[#1a2a32]/60">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="UPDOWNX" className="h-6 w-auto object-contain min-[375px]:h-7 md:h-9 lg:h-12" />
          </Link>
          <div className="flex items-center gap-2 min-[375px]:gap-3 md:gap-4 lg:gap-6">
            <button className="flex items-center gap-1 text-[11px] text-gray-400 min-[375px]:text-xs md:text-sm lg:text-base md:gap-1.5 lg:gap-2">
              EN <ChevronDown className="w-2.5 h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
            </button>
            <Link to="/challenge" className="rounded-lg bg-[#00FFA3] px-2.5 py-1.5 text-[10px] font-bold text-black min-[375px]:px-3 min-[375px]:text-[11px] md:px-5 md:py-2 md:text-sm lg:px-8 lg:py-3 lg:text-lg md:rounded-xl">
              START
            </Link>
            <button onClick={() => setSidebarOpen((p) => !p)} className="text-gray-300 hover:text-white md:p-1 lg:p-2" aria-label="Toggle menu">
              {sidebarOpen ? <X className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" /> : <Menu className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" />}
            </button>
          </div>
        </header>

        {/* Global Tab Menu (Toggled via Hamburger) */}
        {sidebarOpen && (
          <nav className="flex justify-center border-b border-[#1a2a32]/60 bg-[#05070A] px-1 py-2 min-[375px]:px-2 min-[375px]:py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full shadow-lg">
            <div className="flex w-full justify-evenly rounded-[13px] border border-[#12313a] bg-[#081018]/80 p-1 min-[375px]:rounded-[16px] min-[375px]:p-1.5 min-[400px]:rounded-[18px] md:gap-2 md:rounded-[22px] md:px-3 md:py-2 lg:gap-4 lg:rounded-[28px] lg:px-5 lg:py-3">
              {mobileNavTabs.map((tab) => {
                const isActive = isMobileTabActive(tab.route);
                return (
                  <Link
                    key={tab.route}
                    to={tab.route}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex-1 relative flex items-center justify-center text-center rounded-lg px-0.5 py-1.5 text-[8px] leading-tight font-medium transition-colors min-[375px]:rounded-xl min-[375px]:px-1 min-[375px]:py-2 min-[375px]:text-[10px] min-[400px]:px-2 min-[400px]:text-[11px] md:rounded-2xl md:px-6 md:py-3 md:text-sm lg:px-10 lg:py-5 lg:text-lg ${
                      isActive ? "text-[#00FFA3]" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                    <span className={`absolute bottom-1 left-2.5 right-2.5 h-px rounded-full transition-opacity min-[375px]:left-3 min-[375px]:right-3 md:bottom-2 md:left-3 md:right-3 md:h-0.5 lg:bottom-3 lg:left-5 lg:right-5 ${isActive ? "bg-[#00FFA3] opacity-100" : "opacity-0"}`} />
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        <div className="flex-1 overflow-x-clip">
          <PageContent />
        </div>
      </div>

      {/* ═══ DESKTOP LAYOUT (≥ xl) ═══ */}
      <div className="hidden xl:block">
        <DashboardLayout>
          <div className="flex flex-col gap-6 2xl:gap-10">
            <PageContent />
          </div>
        </DashboardLayout>
      </div>
    </>
=======
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl sm:text-2xl tracking-[-0.5px]">
            Payments
          </h1>
          <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-sm">
            Manage your orders and billing history
          </p>
        </div>

        {/* Orders table */}
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <ContentSubsection />
          </div>
        </div>
      </div>
    </DashboardLayout>
>>>>>>> origin/master
  );
};
