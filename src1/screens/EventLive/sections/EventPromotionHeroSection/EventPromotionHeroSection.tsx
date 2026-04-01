import { Button } from "../../../../components/ui/button";

export const EventPromotionHeroSection = (): JSX.Element => {
  return (
    <div className="relative w-full px-8 pt-8">
      <div className="relative w-full rounded-3xl border border-solid border-[#00ffa3] bg-[linear-gradient(211deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%),linear-gradient(0deg,rgba(11,15,20,0.8)_0%,rgba(11,15,20,0.8)_100%)] px-6 py-6 overflow-hidden">
        <div className="relative z-10 flex items-center w-fit mb-3">
          <div className="flex items-center gap-2 px-3 h-[26px] bg-[#00ffa333] rounded-full border border-solid border-[#00ffa34c]">
            <div className="w-2 h-2 bg-[#00ffa3] rounded-full flex-shrink-0" />
            <span className="[font-family:'Public_Sans',Helvetica] font-bold text-[#00ffa3] text-xs tracking-[0] leading-4 whitespace-nowrap">
              EVENT LIVE
            </span>
          </div>
        </div>

        <h1 className="relative z-10 [font-family:'Public_Sans',Helvetica] font-black text-white text-4xl tracking-[-0.90px] leading-9 mb-4">
          WSCT Blockchain Forum 2026 –<br />
          Qualifying Tour
        </h1>

        <p className="relative z-10 [font-family:'Public_Sans',Helvetica] font-normal text-slate-300 text-sm tracking-[0] leading-[22.8px] mb-5">
          Join the elite circle of institutional-grade traders. Complete the
          qualifying assessment
          <br />
          during the WSCT Forum and gain access to a dedicated $1M pool.
        </p>

        <Button className="relative z-10 inline-flex items-center gap-2 px-6 py-2.5 h-auto bg-[#00ffa3] hover:bg-[#00e691] rounded-lg [font-family:'Public_Sans',Helvetica] font-bold text-[#05070a] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
          Read the rules
          <img
            className="flex-[0_0_auto]"
            alt="Arrow"
            src="/container-3.svg"
          />
        </Button>
      </div>
    </div>
  );
};
