import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { useTranslation } from "../../../../lib/i18n";


export const SupportFooterSection = (): JSX.Element => {
  const { t } = useTranslation();

  const quickLinks = [
    t("footer.all_challenges"),
    t("footer.payout_policy"),
    t("footer.risk_disclosure"),
    t("footer.affiliate_program"),
  ];

  const resourceLinks = [
    t("footer.trading_blog"),
    t("footer.help_center"),
    t("footer.discord"),
    t("footer.market_analysis"),
  ];
  return (
    <footer className="flex w-full flex-col items-start border-t border-[#1e262f] border-b-0 border-l-0 border-r-0 bg-[#05070a] px-4 pb-10 pt-16 sm:px-6 lg:px-20 lg:pt-20">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-0">
        {/* Main footer content grid */}
        <div className="grid w-full grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto] lg:gap-x-16">
          {/* Column 1: Logo + Description + Social */}
          <div className="flex min-w-[220px] max-w-[260px] flex-col items-start gap-6 pt-[14px]">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start gap-2.5 -mt-[14px]">
              <img
                className="w-[205px] h-[40.29px] object-contain"
                alt="Logo"
                src="/images/logo.png"
              />
            </Link>

            {/* Description */}
            <div className="flex flex-col items-start">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5">
                {t("footer.description")}
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: "/svg/icon-1.svg", name: "Twitter/X" },
                { icon: "/svg/icon-2.svg", name: "Discord" },
                { icon: "/svg/icon-3.svg", name: "Other" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-solid border-[#1e262f] bg-[#0b0f14] transition-all hover:border-[#00ffa3]/50"
                  aria-label={social.name}
                >
                  <img src={social.icon} alt="" className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start gap-6 pt-[5px]">
            <div className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6">
              {t("footer.quick_links")}
            </div>
            <div className="flex flex-col items-start gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 hover:text-gray-300 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col items-start gap-6 pt-[5px]">
            <div className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6">
              {t("footer.resources")}
            </div>
            <div className="flex flex-col items-start gap-4">
              {resourceLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 hover:text-gray-300 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex w-full flex-col items-start gap-0 pt-[5px] sm:max-w-[320px] lg:w-[268px]">
            <div className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6">
              {t("footer.newsletter")}
            </div>

            <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-4 mt-6">
              {t("footer.newsletter_sub")}
            </p>

            <div className="flex flex-col items-start gap-2 mt-4 w-full">
              {/* Email input */}
              <div className="flex flex-col items-start pt-[13px] pb-3.5 px-4 w-full bg-[#0b0f14] rounded-xl overflow-hidden border border-solid border-[#1e262f]">
                <span className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-[normal]">
                  {t("footer.email_placeholder")}
                </span>
              </div>

              {/* Subscribe button */}
              <Button className="w-full bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] [font-family:'Inter',Helvetica] font-bold text-sm text-center tracking-[0] leading-5 rounded-xl h-auto py-3">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="bg-[#1e262f]" />

        {/* Bottom section: Disclaimer + Copyright */}
        <div className="flex flex-col items-center gap-6 pt-10 w-full">
          {/* Disclaimer */}
          <div className="flex flex-col items-center max-w-4xl w-full">
            <p className="[font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[16.2px] tracking-[1px] text-gray-600">
              {t("footer.disclaimer")}
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center w-full">
            <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
