import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../lib/auth";

export const MainHedgeModuleSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const accountSuffix = user?.account_id?.slice(-4) || "0000";

  return (
    <div className="w-full relative rounded-2xl 2xl:rounded-3xl p-6 sm:p-8 2xl:p-10 flex flex-col xl:flex-row items-center justify-between gap-8 2xl:gap-12 border border-white/5 bg-[linear-gradient(90deg,#0a2118_0%,#05110e_100%)] overflow-hidden">
      
      {/* Container for Card + Info */}
      <div className="flex flex-col md:flex-row items-center gap-10 2xl:gap-14 flex-1 w-full">
        
        {/* The "PRO" Card */}
        <div className="relative w-full max-w-[260px] 2xl:max-w-[340px] h-[150px] 2xl:h-[200px] rounded-2xl bg-[linear-gradient(135deg,#13161c_0%,#07080a_100%)] border border-white/10 p-5 2xl:p-7 flex flex-col justify-between shrink-0 shadow-2xl overflow-hidden group">
           {/* Subtle glow effect inside card */}
           <div className="absolute -top-10 -right-10 w-32 h-32 2xl:w-40 2xl:h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />
           <div className="relative z-10">
             <span className="font-inter font-black italic text-white text-2xl 2xl:text-3xl tracking-tighter">PRO</span>
           </div>
           
           <div className="relative z-10 flex flex-col">
             <span className="font-inter font-bold text-[8px] 2xl:text-[10px] text-gray-500 tracking-[0.2em] uppercase">Master Equity</span>
             <div className="flex items-center mt-2 opacity-80">
               <span className="text-white text-sm 2xl:text-base tracking-[0.4em] leading-none">•••• •••• •••• ••••</span>
             </div>
              <span className="font-inter font-medium text-white text-lg 2xl:text-xl tracking-widest mt-1 leading-none">{accountSuffix}</span>
            </div>
         </div>

        {/* Info columns */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-8 sm:gap-12 2xl:gap-16 w-full">
          
          {/* Left Info */}
          <div className="flex flex-col gap-4 2xl:gap-6 flex-1">
            <div>
              <h2 className="font-inter font-bold text-white text-[26px] 2xl:text-[34px] tracking-tight mb-2 2xl:mb-3">Stage 1</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-[#00ffa3] shadow-[0_0_6px_#00ffa3]" />
                <span className="font-inter font-bold text-[#00ffa3] text-[10px] 2xl:text-[13px] tracking-[0.1em] uppercase">STATUS:CHALLENGE</span>
              </div>
            </div>
            
            <div className="mt-2">
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">START BALANCE</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">100,000.00 USDT</span>
            </div>
          </div>

          {/* Right Info (Divider) */}
          <div className="flex flex-col gap-5 2xl:gap-7 flex-1 sm:border-l sm:border-white/10 sm:pl-10 2xl:pl-14">
            <div>
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">END OF PERIOD</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">Unlimited</span>
            </div>
            <div>
              <span className="font-inter font-medium text-gray-400 text-[10px] 2xl:text-[13px] tracking-[0.08em] uppercase block mb-1 2xl:mb-2">RISK LIMIT (24 HOURS)</span>
              <span className="font-inter font-medium text-white text-[19px] 2xl:text-[26px] tracking-tight">5,000.00 USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row xl:flex-col w-full xl:w-[200px] 2xl:w-[260px] shrink-0 gap-3 2xl:gap-4">
        <button
          onClick={() => navigate("/trading")}
          className="w-full flex justify-center items-center py-3.5 2xl:py-[18px] px-6 2xl:px-8 bg-[#00ffa3] hover:bg-[#00e693] rounded-xl 2xl:rounded-2xl transition-colors shadow-[0_4px_24px_rgba(0,255,163,0.15)]"
        >
          <span className="font-inter font-bold text-[#0b0f14] text-[15px] 2xl:text-[17px] tracking-wide">Trade</span>
        </button>
        <button
          onClick={() => navigate("/control-panel")}
          className="w-full flex justify-center items-center py-3.5 2xl:py-[18px] px-6 2xl:px-8 bg-[#131f1c] hover:bg-[#1a2824] border border-[#ffffff0a] rounded-xl 2xl:rounded-2xl transition-colors"
        >
          <span className="font-inter font-medium text-white text-[15px] 2xl:text-[17px] tracking-wide">Control Panel</span>
        </button>
      </div>
      
    </div>
  );
};
