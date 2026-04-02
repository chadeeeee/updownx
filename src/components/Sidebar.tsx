import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "ACCOUNTS", path: "/accounts" },
  { label: "PAYMENTS", path: "/payments" },
  { label: "NEW CHALLENGE", path: "/new-challenge" },
  { label: "WITHDRAWALS", path: "/withdrawals" },
  { label: "HELP", path: "/help" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-[#0b0f14] border-r border-white/5 transition-transform duration-300 z-40 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full py-6 gap-8">
          {/* Navigation items */}
          <nav className="flex flex-col px-4 gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center w-full gap-1.5 py-2 px-4 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-[#01ffa3] text-[#05070a] font-semibold" 
                    : "bg-transparent text-gray-300 hover:bg-white/5 font-normal"}
                `}
              >
                <span className="text-[13.2px] tracking-tight leading-5 whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Contact Support Card */}
          <div className="mt-auto px-5">
            <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-[#2cf6c34d] to-[#0132264d]">
              <div className="bg-[#0b0f14]/80 rounded-[11px] p-4 flex flex-col items-center gap-3 shadow-xl">
                <p className="text-white text-[11.3px] font-normal leading-4 self-start">
                  Need assistance?
                </p>
                <button 
                  onClick={() => { onClose(); navigate('/support'); }}
                  className="w-full py-2 bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl font-semibold text-[#0b0f14] text-[11.1px] transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};