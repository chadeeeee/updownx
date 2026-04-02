import React from "react";
import { NavAccountsSubsection } from "./sections/NavAccountsSubsection";
import { MainHedgeModuleSubsection } from "./sections/MainHedgeModuleSubsection";

// --- Main screen component ---

export const Accounts = () => {
  return (
    <>
      {/* Background image - decorative */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          className="absolute top-[62px] left-0 w-full h-full object-cover opacity-60"
          alt="Background"
          src="https://c.animaapp.com/mnh4g5xzo5XXIf/img/chatgpt-image-13------2026-----00-54-43-1.png"
        />
      </div>

      <div className="flex-1 flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          
        {/* Account tab nav */}
          <NavAccountsSubsection />

          {/* Trading Identity block */}
          <div className="flex flex-col gap-1.5">
            <header className="font-inter font-bold text-gray-400 text-[10px] tracking-[2.00px] uppercase">
              Trading Identity
            </header>
            <h1 className="font-inter font-normal text-white text-3xl sm:text-4xl tracking-tight">
              ID: 200050316
            </h1>
            <p className="font-inter font-normal text-gray-400 text-sm">
              Institutional Prop Account • Multi-Asset Environment
            </p>
          </div>

          {/* Main hedge module card */}
          <section className="overflow-x-auto pb-2">
            <div className="min-w-[560px]">
              <MainHedgeModuleSubsection />
            </div>
          </section>

          {/* Stats / metrics grid */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {[
              { label: "CURRENT BALANCE", value: "100,000.00 USDT" },
              { label: "EQUITY", value: "100,000.00 USDT" },
              { label: "PROFIT TARGET", value: "10,000.00 USDT" },
              { label: "DAILY LOSS LIMIT", value: "5,000.00 USDT" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative flex flex-col gap-2 p-5 rounded-xl bg-[#0a0c10] border border-white/5 shadow-xl"
              >
                {/* Градієнтна рамка через псевдоелемент, якщо потрібен саме такий ефект */}
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-emerald-500/10" />
                
                <span className="font-inter font-medium text-gray-500 text-[9px] tracking-widest uppercase">
                  {stat.label}
                </span>
                <span className="font-inter font-semibold text-white text-base sm:text-lg tracking-tight">
                  {stat.value}
                </span>
              </div>
            ))}
          </section>
      </div>
    </>
  );
};