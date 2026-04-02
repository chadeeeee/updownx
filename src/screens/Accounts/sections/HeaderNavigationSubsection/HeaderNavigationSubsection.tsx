import React from "react";
import { Link } from "react-router-dom";

export const HeaderNavigationSubsection = ({ onMenuToggle, logoSrc, avatarSrc }: { onMenuToggle: () => void; logoSrc: string; avatarSrc: string }): JSX.Element => (
  <header className="flex h-16 items-center justify-between px-6 bg-[#05070a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      <button onClick={onMenuToggle} className="p-2 -ml-2 text-white/60 hover:text-white lg:hidden">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <Link to="/">
        <img src={logoSrc} alt="UPDOWNX" className="h-7 w-auto object-contain" />
      </Link>
    </div>
    <div className="flex items-center gap-4">
      {/* Search / Notifications could go here */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 p-0.5">
        <img src={avatarSrc} alt="User" className="h-full w-full rounded-full object-cover" />
      </div>
    </div>
  </header>
);
