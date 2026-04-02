import { useState } from "react";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "../../components/Sidebar";
import { ContentSubsection } from "./sections/ContentSubsection";

export const Payments = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#05070a] flex flex-col overflow-x-hidden">
      {/* Background decorative images */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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

      {/* Top navigation bar */}
      <div className="relative z-30">
        <TopBar
          onMenuToggle={() => setSidebarOpen(true)}
          logoSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo-1.png"
          avatarSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/avatar-1.png"
        />
      </div>

      {/* Main content area: sidebar + page content */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Page content */}
        <main className="flex-1 flex flex-col gap-5 p-4 sm:p-6 min-w-0 overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
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
          <div className="min-w-[480px]">
            <ContentSubsection />
          </div>
        </main>
      </div>
    </div>
  );
};
