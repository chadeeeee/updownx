import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

const quickLinks = [
  "All Challenges",
  "Payout Policy",
  "Risk Disclosure",
  "Affiliate Program",
];

const resourceLinks = [
  "Trading Blog",
  "Help Center",
  "Discord Community",
  "Market Analysis",
];

export const SupportFooterSection = (): JSX.Element => {
  const [email, setEmail] = useState("");

  return (
    <footer className="flex flex-col items-start pt-20 pb-10 px-20 w-full bg-[#05070a] border-t border-[#1e262f] border-r-0 border-b-0 border-l-0">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-0">
        {/* Main footer content grid */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-16 w-full pb-10">
          {/* Column 1: Logo + Description + Social */}
          <div className="flex flex-col items-start gap-6 pt-[14px] min-w-[220px] max-w-[260px]">
            {/* Logo */}
            <div className="flex flex-col items-start gap-2.5 -mt-[14px]">
              <img
                className="w-[205px] h-[40.29px] object-contain"
                alt="Logo"
                src="/logo-1.png"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col items-start">
              <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5">
                The world&#39;s leading crypto prop trading
                <br />
                firm. Empowering traders with the
                <br />
                capital they need to succeed in the
                <br />
                digital asset market.
              </p>
            </div>

            {/* Social icons */}
            <img className="w-full" alt="Container" src="/container-1.svg" />
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start gap-6 pt-[5px]">
            <div className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6">
              Quick Links
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
              Resources
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
          <div className="flex flex-col items-start gap-0 pt-[5px] w-[268px]">
            <div className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6">
              Newsletter
            </div>

            <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-4 mt-6">
              Get weekly trading tips and platform updates.
            </p>

            <div className="flex flex-col items-start gap-2 mt-4 w-full">
              {/* Email input */}
              <div className="flex flex-col items-start pt-[13px] pb-3.5 px-4 w-full bg-[#0b0f14] rounded-xl overflow-hidden border border-solid border-[#1e262f]">
                <span className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-[normal]">
                  Your Email
                </span>
              </div>

              {/* Subscribe button */}
              <Button className="w-full bg-[#00ffa3] hover:bg-[#00e693] text-[#05070a] [font-family:'Inter',Helvetica] font-bold text-sm text-center tracking-[0] leading-5 rounded-xl h-auto py-3">
                Subscribe
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
            <p className="[font-family:'Inter',Helvetica] font-normal text-gray-600 text-[10px] text-center tracking-[1.00px] leading-[16.2px]">
              DISCLAIMER: TRADING CRYPTOCURRENCIES INVOLVES SIGNIFICANT RISK AND
              CAN RESULT IN THE LOSS OF YOUR INVESTED CAPITAL. YOU SHOULD NOT
              <br />
              INVEST MORE THAN YOU CAN AFFORD TO LOSE AND SHOULD ENSURE THAT YOU
              FULLY UNDERSTAND THE RISKS INVOLVED. UPDOWNX IS A PROP
              <br />
              TRADING FIRM AND DOES NOT PROVIDE FINANCIAL ADVICE.
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center w-full">
            <p className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
              © 2024 UPDOWNX. All rights reserved. Built for professional
              traders.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
