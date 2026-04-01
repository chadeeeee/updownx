import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Stat card data
const stats = [
  {
    value: "4,578+",
    label: "ACTIVE TRADERS",
    valueColor: "text-white",
    labelColor: "text-[#00ffa3]",
    row: "row-[1_/_2]",
    col: "col-[1_/_2]",
  },
  {
    value: "$11M+",
    label: "TOTAL PAYOUTS",
    valueColor: "text-white",
    labelColor: "text-[#00ffa3]",
    row: "row-[1_/_2]",
    col: "col-[2_/_3]",
  },
  {
    value: "$14,200",
    label: "AVG. MONTHLY PAYOUT",
    valueColor: "text-white",
    labelColor: "text-[#00ffa3]",
    row: "row-[2_/_3]",
    col: "col-[1_/_2]",
  },
  {
    value: "99.9%",
    label: "UPTIME RELIABILITY",
    valueColor: "text-[#00ffa3]",
    labelColor: "text-[#ffffff80]",
    row: "row-[2_/_3]",
    col: "col-[2_/_3]",
  },
];

export const InstitutionalOverviewSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-start px-28 py-24 bg-[#0b0f144c]">
      <div className="flex items-center gap-16 relative self-stretch w-full">
        {/* Left: Text content */}
        <div className="flex flex-col items-start gap-[16.5px] relative flex-1 grow">
          {/* OUR STORY label */}
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-sm tracking-[1.40px] leading-5 whitespace-nowrap">
            OUR STORY
          </span>

          {/* Heading */}
          <h2 className="self-stretch [font-family:'Inter',Helvetica] font-extrabold text-white text-4xl tracking-[0] leading-[45px]">
            Empowering Global Traders
            <br />
            with Institutional Power
          </h2>

          {/* Description */}
          <div className="flex flex-col items-start pt-[7.5px] pb-0 px-0 self-stretch w-full">
            <p className="self-stretch [font-family:'Inter',Helvetica] font-normal text-gray-400 text-lg tracking-[0] leading-[29.2px]">
              UPDOWNX was born from the vision of professional traders who
              <br />
              believe talent should never be limited by capital. We provide the
              <br />
              infrastructure, liquidity, and risk management tools to turn
              skilled
              <br />
              individuals into institutional-grade crypto traders.
            </p>
          </div>

          {/* Read Mission button */}
          <div className="flex items-center self-stretch w-full">
            <Button
              variant="outline"
              className="h-auto px-6 py-3 rounded-xl border border-solid border-[#00ffa3] bg-transparent hover:bg-[#00ffa310] text-[#00ffa3] hover:text-[#00ffa3] [font-family:'Inter',Helvetica] font-bold text-base leading-6"
            >
              Read Mission
            </Button>
          </div>
        </div>

        {/* Right: Stats grid */}
        <div className="grid grid-cols-2 grid-rows-[126px_126px] h-[276px] gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`${stat.row} ${stat.col} w-full h-fit flex flex-col items-start justify-center p-8 rounded-3xl bg-[#0b0f14] border border-solid border-[#1e262f]`}
            >
              <CardContent className="p-0 flex flex-col items-start w-full gap-0">
                {/* Stat value */}
                <div className="flex flex-col items-start pb-1 w-full">
                  <span
                    className={`self-stretch [font-family:'Inter',Helvetica] font-black ${stat.valueColor} text-3xl tracking-[0] leading-9`}
                  >
                    {stat.value}
                  </span>
                </div>
                {/* Stat label */}
                <div className="flex flex-col items-start w-full">
                  <span
                    className={`self-stretch [font-family:'Inter',Helvetica] font-bold ${stat.labelColor} text-sm tracking-[0.70px] leading-5`}
                  >
                    {stat.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
