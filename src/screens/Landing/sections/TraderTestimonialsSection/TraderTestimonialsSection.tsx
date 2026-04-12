import { Card, CardContent } from "../../../../components/ui/card";
import { useTranslation } from "../../../../lib/i18n";

const testimonialKeys = [
  { nameKey: "testimonials.t1_name", roleKey: "testimonials.t1_role", quoteKey: "testimonials.t1_quote", avatar: "/images/user-1.png" },
  { nameKey: "testimonials.t2_name", roleKey: "testimonials.t2_role", quoteKey: "testimonials.t2_quote", avatar: "/images/user-2.png" },
  { nameKey: "testimonials.t3_name", roleKey: "testimonials.t3_role", quoteKey: "testimonials.t3_quote", avatar: "/images/user-3.png" },
];

export const TraderTestimonialsSection = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="flex w-full bg-[#0b0f1433] py-16">
      <div className="mx-4 flex flex-1 flex-col gap-10 sm:mx-6 lg:mx-20 lg:gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="flex items-center justify-center gap-3 text-center [font-family:'Inter',Helvetica] text-3xl font-extrabold leading-tight tracking-[0] text-white sm:text-4xl sm:leading-10">
            {t("testimonials.title")}
          </h2>

          <div className="flex items-center justify-center gap-1 h-6">
            <img className="w-5 h-5" alt="Rating star" src="/svg/star.svg" />
            <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
              {t("testimonials.rating")}
            </span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {testimonialKeys.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-[#0b0f14] rounded-3xl border border-solid border-[#1e262f] shadow-none"
            >
              <CardContent className="flex flex-col gap-[23px] p-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${testimonial.avatar})` }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                      {t(testimonial.nameKey)}
                    </span>
                    <span className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                      {t(testimonial.roleKey)}
                    </span>
                  </div>
                </div>
                <p className="[font-family:'Inter',Helvetica] font-normal italic text-gray-400 text-sm tracking-[0] leading-[22.8px]">
                  {t(testimonial.quoteKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
