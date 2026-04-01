import { Card, CardContent } from "../../../../components/ui/card";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Professional Scalper",
    avatar: "/user.png",
    quote:
      '"The latency on UPDOWNX is incredible. Execution is instant even during high volatility. My first payout was processed in less than 4 hours!"',
  },
  {
    name: "Sarah Jenkins",
    role: "Day Trader",
    avatar: "/user-1.png",
    quote:
      '"I\'ve tried 4 different prop firms, and none compare to the crypto asset selection here. 160+ tokens to trade with great leverage."',
  },
  {
    name: "Michael Chen",
    role: "Swing Trader",
    avatar: "/user-2.png",
    quote:
      '"Fair rules, clear dashboard, and a very supportive community. The 80% profit share is a game changer for my financial freedom."',
  },
];

export const TraderTestimonialsSection = (): JSX.Element => {
  return (
    <section className="w-full bg-[#0b0f1433] py-16 flex">
      <div className="flex-1 mx-20 flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="[font-family:'Inter',Helvetica] font-normal text-white text-4xl text-center tracking-[0] leading-10 whitespace-nowrap">
            Loved by Professional Traders
          </h2>

          <div className="flex items-center justify-center gap-1 h-6">
            <img className="w-5 h-5" alt="Rating star" src="/svg.svg" />
            <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
              Excellent 4.9 out of 5
            </span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-[#0b0f14] rounded-3xl border border-solid border-[#1e262f] shadow-none"
            >
              <CardContent className="flex flex-col gap-[23px] p-8">
                {/* User info */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${testimonial.avatar})` }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                      {testimonial.name}
                    </span>
                    <span className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                      {testimonial.role}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="[font-family:'Inter',Helvetica] font-normal italic text-gray-400 text-sm tracking-[0] leading-[22.8px]">
                  {testimonial.quote}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
