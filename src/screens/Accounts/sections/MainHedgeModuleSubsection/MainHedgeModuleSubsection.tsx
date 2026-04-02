export const MainHedgeModuleSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-[#0b0f14] p-6 rounded-2xl"> {/* Головний контейнер */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Middle info section */}
        <div className="flex flex-col sm:flex-row items-start flex-1 w-full gap-8 sm:gap-0">
          
          {/* Left info column */}
          <div className="flex flex-col items-start gap-[15.69px] flex-1 min-w-0">
            {/* Stage + Status */}
            <div className="flex flex-col items-start gap-[7.85px] w-full">
              <span className="font-inter font-bold text-white text-[23.5px] tracking-[-0.59px] leading-[31.4px]">
                Stage 1
              </span>
              <div className="flex items-center gap-[7.85px]">
                <div className="w-[7.85px] h-[7.85px] shrink-0 bg-[#00ffa3] rounded-full shadow-[0px_0px_7.85px_#33fb0a66]" />
                <span className="font-inter font-bold text-[#00ffa3] text-[9.8px] tracking-[0.49px] leading-[14.7px] whitespace-nowrap">
                  STATUS: CHALLENGE
                </span>
              </div>
            </div>

            {/* Start Balance */}
            <div className="flex flex-col items-start gap-[3.92px] w-full">
              <span className="font-inter font-normal text-gray-400 text-[9.8px] tracking-[0.49px] leading-[14.7px]">
                START BALANCE
              </span>
              <span className="font-inter font-medium text-white text-[17.7px] tracking-[0] leading-[27.5px]">
                100,000.00 USDT
              </span>
            </div>
          </div>

          {/* Right info column */}
          <div className="flex flex-col items-start gap-[15.69px] pl-0 sm:pl-[31.39px] flex-1 min-w-0 sm:border-l-[0.98px] sm:border-solid sm:border-[#4d473233]">
            {/* End of Period */}
            <div className="flex flex-col items-start gap-[3.92px] w-full">
              <span className="font-inter font-normal text-gray-400 text-[9.8px] tracking-[0.49px] leading-[14.7px]">
                END OF PERIOD
              </span>
              <span className="font-inter font-medium text-white text-[17.7px] tracking-[0] leading-[27.5px]">
                Unlimited
              </span>
            </div>

            {/* Risk Limit */}
            <div className="flex flex-col items-start gap-[3.92px] w-full">
              <span className="font-inter font-normal text-gray-400 text-[9.8px] tracking-[0.49px] leading-[14.7px]">
                RISK LIMIT (24 HOURS)
              </span>
              <span className="font-inter font-medium text-white text-[17.7px] tracking-[0] leading-[27.5px]">
                5,000.00 USDT
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-row sm:flex-col w-full sm:w-auto sm:min-w-[196.18px] items-center sm:items-start gap-3 sm:gap-[11.77px] shrink-0">
          <button className="flex-1 sm:flex-none w-full flex flex-col justify-center px-[31.39px] py-[11.77px] bg-[#00ffa3] hover:bg-[#00e693] rounded-xl items-center h-auto border-0 cursor-pointer transition-colors">
            <span className="font-inter font-bold text-[#0b0f14] text-[15.7px] text-center tracking-[0] leading-[23.5px] whitespace-nowrap">
              Trade
            </span>
          </button>

          <button className="flex-1 sm:flex-none w-full flex flex-col justify-center px-[31.39px] py-[11.77px] rounded-xl border-[0.98px] border-solid border-[#ffffff1a] bg-transparent hover:bg-[#ffffff0d] items-center h-auto cursor-pointer transition-colors">
            <span className="font-inter font-normal text-[#e1e2e7] text-[15.7px] text-center tracking-[0] leading-[23.5px] whitespace-nowrap">
              Control Panel
            </span>
          </button>
        </div>
        
      </div>
    </div>
  );
};