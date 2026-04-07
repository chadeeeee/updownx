import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SAMPLE_ORDERS = [
  { id: 93821, date: "May 12, 2026", status: "COMPLETED", total: "199.00 USDT", items: 1 },
  { id: 93822, date: "May 15, 2026", status: "PENDING", total: "49.00 USDT", items: 1 },
  { id: 93823, date: "May 18, 2026", status: "CANCELLED", total: "99.00 USDT", items: 2 },
  { id: 93824, date: "May 20, 2026", status: "COMPLETED", total: "299.00 USDT", items: 4 },
  { id: 93825, date: "May 22, 2026", status: "COMPLETED", total: "149.00 USDT", items: 1 },
];

type StatusStyle = { bg: string; border: string; dot: string; text: string };

const STATUS_CONFIG: { [key: string]: StatusStyle } = {
  COMPLETED: { bg: "bg-[#00ffa3]/10", border: "border-[#00ffa3]/20", dot: "bg-[#00ffa3]", text: "text-[#00ffa3]" },
  PENDING: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", dot: "bg-yellow-500", text: "text-yellow-500" },
  CANCELLED: { bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", text: "text-red-500" },
  default: { bg: "bg-gray-500/10", border: "border-gray-500/20", dot: "bg-gray-500", text: "text-gray-500" },
};

export const ContentSubsection = () => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(SAMPLE_ORDERS.length / itemsPerPage);
  const startItem = (activePage - 1) * itemsPerPage + 1;
  const endItem = Math.min(activePage * itemsPerPage, SAMPLE_ORDERS.length);
  const pageOrders = SAMPLE_ORDERS.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Header - Hidden on Mobile */}
      <div className="hidden sm:flex items-center justify-between px-2.5 py-2 self-stretch w-full border-b border-[#1a1f26]">
        <div className="w-[120px] font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">
          ORDER
        </div>
        <div className="w-[120px] font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">
          DATE
        </div>
        <div className="w-[120px] font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">
          STATUS
        </div>
        <div className="w-[120px] font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">
          TOTAL
        </div>
        <div className="w-[108px] flex justify-end font-inter font-bold text-gray-500 text-[10px] tracking-[1.00px] uppercase">
          ACTIONS
        </div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col gap-1.5 sm:gap-2 2xl:gap-3">
        {pageOrders.map((order, index) => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.default;
          return (
            <div
              key={order.id || index}
              className="flex flex-row h-[36px] min-[375px]:h-[42px] sm:h-[56px] 2xl:h-[70px] items-center justify-between gap-0.5 min-[375px]:gap-2 sm:gap-0 px-1 min-[375px]:px-2 sm:px-4 2xl:px-8 self-stretch w-full bg-[#0b0f14] rounded-lg sm:rounded-xl 2xl:rounded-2xl border border-transparent hover:border-white/5 transition-all shadow-sm"
            >
              {/* ID / Order Column */}
              <div className="flex items-center w-fit sm:w-[120px] 2xl:w-[150px] shrink-0">
                <span className="font-inter font-bold text-white text-[7px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base leading-none">
                  №{order.id}
                </span>
              </div>

              {/* Date Column */}
              <div className="flex items-center w-fit sm:w-[120px] 2xl:w-[150px] shrink overflow-hidden">
                <div className="font-inter font-normal text-[#c2c5cd] text-[6.5px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base leading-none whitespace-nowrap text-ellipsis overflow-hidden">
                  {order.date}
                </div>
              </div>

              {/* Status Column */}
              <div className="flex items-center w-fit sm:w-[120px] 2xl:w-[150px] shrink-0">
                <div className={`inline-flex items-center gap-[1px] sm:gap-2 px-0.5 py-[1px] min-[375px]:px-1 min-[375px]:py-[2px] sm:px-3 sm:py-1 ${config.bg} rounded-full border border-solid ${config.border}`}>
                  <div className={`w-[2px] h-[2px] min-[375px]:w-[3px] min-[375px]:h-[3px] sm:w-[5px] sm:h-[5px] ${config.dot} rounded-full shadow-[0_0_8px_currentColor]`} />
                  <span className={`font-inter font-bold ${config.text} text-[4px] min-[375px]:text-[6px] sm:text-[9px] tracking-[0.50px] uppercase whitespace-nowrap leading-none`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Total Column */}
              <div className="flex items-center w-fit sm:w-[120px] 2xl:w-[150px] shrink overflow-hidden">
                <div className="flex items-center gap-[1px] sm:gap-2 min-w-0">
                  <div className="font-inter font-bold text-white text-[7px] min-[375px]:text-[10px] sm:text-sm 2xl:text-base leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                    {order.total}
                  </div>
                  <div className="font-inter font-medium text-[#00ffa3] text-[5px] min-[375px]:text-[7px] sm:text-[9px] leading-none whitespace-nowrap shrink-0">
                    / {order.items === 1 ? '1 item' : `${order.items} items`}
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="flex w-fit sm:w-[108px] 2xl:w-[140px] justify-end shrink-0">
                <button
                  className="h-3.5 min-[375px]:h-5 sm:h-7 2xl:h-9 px-1 min-[375px]:px-2 sm:px-4 2xl:px-5 bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-full flex items-center justify-center cursor-pointer transition-all border border-[#00ffa3]/20"
                  onClick={() => { console.log('View', order.id) }}
                >
                  <span className="font-inter font-bold text-[#05070a] text-[5.5px] min-[375px]:text-[7px] sm:text-[10px] 2xl:text-xs whitespace-nowrap shrink-0">
                    View Details
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer (Desktop only) */}
      <div className="hidden xl:flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
        <div className="font-inter font-normal text-gray-500 text-[11px]">
          Showing <span className="text-white">{startItem}</span> to <span className="text-white">{endItem}</span> of {SAMPLE_ORDERS.length} entries
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="w-8 h-8 rounded-lg border border-white/5 bg-transparent hover:bg-white/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => setActivePage(p => Math.max(1, p - 1))}
            disabled={activePage === 1}
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>

          <div className="flex gap-1">
            {pageNumbers.map((page, i, arr) => (
              <React.Fragment key={i}>
                {i > 0 && arr[i - 1] !== page - 1 && (
                  <span className="text-gray-500 self-end px-1">...</span>
                )}
                <button
                  className={`w-8 h-8 rounded-lg font-inter font-bold text-[11px] transition-all border ${
                    activePage === page
                      ? "bg-[#00ffa3] text-black border-transparent shadow-[0_0_12px_rgba(0,255,163,0.2)]"
                      : "bg-transparent text-gray-400 border-white/5 hover:bg-white/5"
                  }`}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          </div>

          <button
            className="w-8 h-8 rounded-lg border border-white/5 bg-transparent hover:bg-white/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Assistance Footer (Mobile/Tablet only) */}
      <div className="flex xl:hidden w-full mt-3 sm:mt-6">
        <div className="w-full rounded-2xl border border-[#163a3c] bg-gradient-to-r from-[#061616] to-[#0b1f1f] p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-4 shadow-lg">
          <span className="text-white text-[11px] sm:text-base font-medium">Need assistance?</span>
          <div className="flex flex-row gap-2 sm:gap-4">
            <button className="flex-1 bg-[#00FFA3] hover:bg-[#00FFA3]/90 text-black text-[9px] sm:text-sm font-bold min-h-[34px] sm:min-h-[44px] py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-colors w-full">
              Contact Support
            </button>
            <button className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[9px] sm:text-sm font-medium min-h-[34px] sm:min-h-[44px] py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-colors w-full">
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};