import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { useTranslation } from "../../../../lib/i18n";

export const InstitutionalOverviewSection = (): JSX.Element => {
  const { t } = useTranslation();

  const stats = [
    {
      value: t("institutional.active_traders"),
      label: t("institutional.active_traders_label"),
      valueColor: "text-white",
      labelColor: "text-[#00ffa3]",
      row: "lg:row-[1_/_2]",
      col: "lg:col-[1_/_2]",
    },
    {
      value: t("institutional.total_payouts"),
      label: t("institutional.total_payouts_label"),
      valueColor: "text-white",
      labelColor: "text-[#00ffa3]",
      row: "lg:row-[1_/_2]",
      col: "lg:col-[2_/_3]",
    },
    {
      value: t("institutional.avg_monthly"),
      label: t("institutional.avg_monthly_label"),
      valueColor: "text-white",
      labelColor: "text-[#00ffa3]",
      row: "lg:row-[2_/_3]",
      col: "lg:col-[1_/_2]",
    },
    {
      value: t("institutional.uptime"),
      label: t("institutional.uptime_label"),
      valueColor: "text-[#00ffa3]",
      labelColor: "text-[#ffffff80]",
      row: "lg:row-[2_/_3]",
      col: "lg:col-[2_/_3]",
    },
  ];
  return (
    <section className="flex w-full flex-col items-start bg-[#0b0f144c] px-4 py-16 sm:px-6 lg:px-28 lg:py-24">
      <div className="relative flex w-full flex-col gap-10 self-stretch lg:flex-row lg:items-center lg:gap-16">
        {/* Left: Text content */}
        <div className="flex flex-col items-start gap-[16.5px] relative flex-1 grow">
          {/* OUR STORY label */}
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-sm tracking-[1.40px] leading-5 whitespace-nowrap">
            {t("institutional.label")}
          </span>

          {/* Heading */}
          <h2 className="self-stretch [font-family:'Inter',Helvetica] text-3xl font-extrabold leading-tight tracking-[0] text-white sm:text-4xl sm:leading-[45px]">
            {t("institutional.title_line1")}
            <br />
            {t("institutional.title_line2")}
          </h2>

          {/* Description */}
          <div className="flex w-full flex-col items-start self-stretch px-0 pb-0 pt-[7.5px]">
            <p className="self-stretch [font-family:'Inter',Helvetica] text-base font-normal leading-7 tracking-[0] text-gray-400 sm:text-lg sm:leading-[29.2px]">
              {t("institutional.description")}
            </p>
          </div>

          {/* Read Mission button */}
          <div className="flex items-center self-stretch w-full">
            <Button
              variant="outline"
              className="h-auto px-6 py-3 rounded-xl border border-solid border-[#00ffa3] bg-transparent hover:bg-[#00ffa310] text-[#00ffa3] hover:text-[#00ffa3] [font-family:'Inter',Helvetica] font-bold text-base leading-6"
            >
              {t("institutional.button")}
            </Button>
          </div>
        </div>

        {/* Right: Stats grid */}
        <div className="grid h-auto w-full grid-cols-2 gap-3 sm:gap-6 lg:max-w-[560px]">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`${stat.row} ${stat.col} h-[98px] sm:h-fit w-full rounded-[24px] border border-solid border-[#1e262f] bg-[#0b0f14] p-[10px] sm:p-8 flex flex-col items-center justify-center`}
            >
              <CardContent className="p-0 flex flex-col items-center sm:items-start w-full gap-0">
                {/* Stat value */}
                <div className="flex flex-col items-center sm:items-start pb-1 w-full">
                  <span
                    className={`self-stretch text-center sm:text-left [font-family:'Inter',Helvetica] font-black ${stat.valueColor} text-2xl sm:text-3xl tracking-[0] leading-7 sm:leading-9`}
                  >
                    {stat.value}
                  </span>
                </div>
                {/* Stat label */}
                <div className="flex flex-col items-center sm:items-start w-full">
                  <span
                    className={`self-stretch text-center sm:text-left [font-family:'Inter',Helvetica] font-bold ${stat.labelColor} text-[10px] sm:text-sm tracking-[0.70px] leading-4 sm:leading-5`}
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
