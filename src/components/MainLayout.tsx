import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#05070a]">
      <div className="relative z-30">
        <TopBar
          onMenuToggle={() => setSidebarOpen(true)}
          logoSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/logo.png"
          avatarSrc="https://c.animaapp.com/mnh4g5xzo5XXIf/img/avatar.png"
        />
      </div>

      <div className="flex flex-1 relative z-10">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Outlet />
      </div>
    </div>
  );
};
