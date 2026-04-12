import React from "react";
import { useTranslation } from "../../../../lib/i18n";

const sidebarKeys = [
  { labelKey: "sidebar.dashboard", value: "DASHBOARD" },
  { labelKey: "sidebar.accounts", value: "ACCOUNTS" },
  { labelKey: "sidebar.payments", value: "PAYMENTS" },
  { labelKey: "sidebar.withdrawals", value: "WITHDRAWALS" },
  { labelKey: "sidebar.help", value: "HELP" },
];

export const LandingSlidebarSubsection = ({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }): JSX.Element => {
  const { t } = useTranslation();
  return (
  <>
    {/* Mobile Overlay */}
    {mobileOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
    )}
    
    <aside className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-[#05070a] border-r border-white/5 transition-transform duration-300 z-40 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex flex-col h-full p-6 pt-20 lg:pt-6">
        <nav className="flex-1 space-y-2">
          {sidebarKeys.map((item) => (
            <a key={item.value} href="#" className={`flex items-center px-4 py-3 text-xs font-bold tracking-widest rounded-xl transition-all ${item.value === "ACCOUNTS" ? "bg-[#00ffa3] text-black shadow-[0_0_12px_rgba(0,255,163,0.2)]" : "text-white/40 hover:text-white"}`}>
              {t(item.labelKey)}
            </a>
          ))}
        </nav>
        
        {/* Support widget placeholder */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-auto">
          <p className="text-[10px] text-white/60 mb-2 font-medium">{t("sidebar.any_questions")}</p>
          <button className="w-full py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-colors">
            {t("sidebar.help_center")}
          </button>
        </div>
      </div>
    </aside>
  </>
);
};
