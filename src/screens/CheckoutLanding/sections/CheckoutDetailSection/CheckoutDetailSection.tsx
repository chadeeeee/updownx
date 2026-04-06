import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";

/* Reusable gradient-border card style applied via className */
const gradientCardClass =
  "relative bg-[#05070a] rounded-xl border-none before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-xl before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none";

/* Order summary line items */
const orderLineItems = [
  { label: "Subtotal", value: "$799.00", valueClass: "text-white font-medium" },
  {
    label: "Platform Fee",
    value: "Free",
    valueClass: "text-[#00ffa3] font-medium",
  },
];

export const CheckoutDetailSection = (): JSX.Element => {
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string | null>("crypto");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col w-full items-end justify-center gap-5 pr-8 pb-8">
      {/* Main two-column layout */}
      <div className="flex items-start gap-5 w-full">
        {/* Left column: Billing Details + Payment Method */}
        <div className="flex flex-col flex-1 items-start gap-[34px]">
          {/* Billing Details Card */}
          <div
            className={`${gradientCardClass} flex flex-col gap-8 w-full p-[33px]`}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 h-7">
              <img
                className="w-6 h-7 flex-shrink-0"
                alt="Billing icon"
                src="/svg/billing-man.svg"
              />
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7 whitespace-nowrap">
                BILLING DETAILS
              </span>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6 w-full">
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    FULL NAME
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden focus-within:border-[#00ffa3] transition-colors">
                    <input
                      name="fullName"
                      value={billingInfo.fullName}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                      placeholder="Enter Full Name"
                    />
                  </div>
                </div>

                {/* E-mail Address */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    E-MAIL ADDRESS
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden focus-within:border-[#00ffa3] transition-colors">
                    <input
                      name="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                      placeholder="Enter E-mail"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Country/Region + City/Town */}
              <div className="grid grid-cols-2 gap-6">
                {/* Country/Region dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    COUNTRY/REGION
                  </label>
                  <div className="relative flex items-center h-[50px] bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] px-4 cursor-pointer hover:border-[#00ffa366] transition-colors">
                    <input
                      name="country"
                      value={billingInfo.country}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6 cursor-pointer"
                      placeholder="Select Country"
                    />
                  </div>
                </div>

                {/* City/Town */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                    CITY/TOWN
                  </label>
                  <div className="flex items-center px-4 py-3 bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] overflow-hidden focus-within:border-[#00ffa3] transition-colors">
                    <input
                      name="city"
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full [font-family:'Public_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-6"
                      placeholder="Enter City"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div
            className={`${gradientCardClass} flex flex-col gap-6 w-full p-[33px]`}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 h-7">
              <img
                className="w-6 h-7 flex-shrink-0"
                alt="Wallet icon"
                src="/svg/wallet.svg"
              />
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7 whitespace-nowrap">
                PAYMENT METHOD
              </span>
            </div>

            {/* Crypto Payment Option */}
            <div
              onClick={() => setPaymentMethod(paymentMethod === "crypto" ? null : "crypto")}
              className={`relative w-full h-[92px] bg-[#2cf6c30d] rounded-xl border-none cursor-pointer group
                before:content-[''] before:absolute before:inset-0 before:p-0.5 before:rounded-xl
                before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
                before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
                before:z-[1] before:pointer-events-none ${paymentMethod === "crypto" ? "bg-[#2cf6c31a]" : "hover:bg-[#2cf6c314]"} transition-all`}
            >
              {/* Payment info */}
              <div className="flex items-center gap-4 absolute top-1/2 -translate-y-1/2 left-[22px]">
                <div className="w-12 h-12 flex items-center justify-center bg-[#05070a] rounded-lg border border-solid border-[#00ffa333] flex-shrink-0 group-hover:border-[#00ffa366] transition-colors">
                  <img
                    className="w-[17px] h-[23px] flex-shrink-0"
                    alt="Crypto icon"
                    src="/svg/btc.svg"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                    CRYPTO PAYMENT
                  </span>
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                    BTC, ETH, USDT, USDC (Fast &amp; Secure)
                  </span>
                </div>
              </div>

              {/* Radio button indicator */}
              <div className={`absolute top-1/2 -translate-y-1/2 right-[22px] w-6 h-6 border-2 border-solid rounded-full border-[#00ffa3] flex items-center justify-center transition-all ${paymentMethod === "crypto" ? "bg-[#00ffa333]" : ""}`}>
                {paymentMethod === "crypto" && (
                  <img src="/svg/tick.svg" alt="selected" className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Your Order */}
        <div
          className={`${gradientCardClass} flex flex-col gap-8 w-[448px] p-[33px] flex-shrink-0`}
        >
          {/* Order Title */}
          <h2 className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xl tracking-[-0.50px] leading-7">
            YOUR ORDER
          </h2>

          {/* Order Item */}
          <div
            className="relative w-full h-[74px] bg-[#05070a] rounded-lg border-none
              before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg
              before:[background:linear-gradient(227deg,rgba(44,246,195,0.3)_0%,rgba(1,50,38,0.3)_100%)]
              before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
              before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]
              before:z-[1] before:pointer-events-none"
          >
            <div className="flex items-center justify-between h-full px-[17px]">
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#0b0f14] rounded-lg border border-solid border-[#00ffa333] flex-shrink-0">
                  <img
                    className="w-6 h-6 flex-shrink-0"
                    alt="Elite Challenge"
                    src="/svg/diamond.svg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                    ELITE CHALLENGE
                  </span>
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-slate-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                    100K Account Size
                  </span>
                </div>
              </div>
              {/* Item price */}
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                $799.00
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div
            className="flex flex-col gap-2.5 w-full pt-2.5 border-t border-transparent"
            style={{
              borderImage:
                "linear-gradient(227deg,rgba(44,246,195,0.3) 0%,rgba(1,50,38,0.3) 100%) 1",
            }}
          >
            {/* Line items */}
            <div className="flex flex-col gap-2 w-full">
              {orderLineItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between w-full h-5"
                >
                  <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {item.label}
                  </span>
                  <span
                    className={`[font-family:'Public_Sans',Helvetica] text-sm tracking-[0] leading-5 whitespace-nowrap ${item.valueClass}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="flex items-end justify-between w-full mt-4">
              <span className="[font-family:'Public_Sans',Helvetica] font-bold text-gray-500 text-xs tracking-[1.20px] leading-4 whitespace-nowrap">
                TOTAL AMOUNT
              </span>
              <span className="[font-family:'Public_Sans',Helvetica] font-black text-white text-3xl tracking-[0] leading-9 whitespace-nowrap">
                $799.00
              </span>
            </div>
          </div>

          {/* Complete Order Button + Privacy Notice */}
          <div className="flex flex-col gap-0 w-full">
            {/* Complete Order Button */}
            <Button
              className="w-full h-[60px] bg-[#00ffa3] hover:bg-[#00ffa3]/90 rounded-xl shadow-[0px_4px_6px_-4px_#a3e63533,0px_10px_15px_-3px_#a3e63533] [font-family:'Public_Sans',Helvetica] font-black text-slate-950 text-lg text-center tracking-[-0.90px] leading-7 whitespace-nowrap border-none"
              style={{ height: "60px" }}
            >
              COMPLETE ORDER
            </Button>

            {/* Privacy Notice */}
            <div className="w-full mt-7 bg-[#02061780] rounded-lg border border-solid border-[#ffffff0d] px-[17px] py-[17px]">
              <p className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-[10px] text-center tracking-[0] leading-[16.2px]">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <span className="text-[#2cf6c3] cursor-pointer">
                  Privacy Policy
                </span>
                . By completing the order, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${gradientCardClass} inline-flex items-center gap-4 p-[25px] flex-shrink-0 backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]`}
      >
        <div className="w-12 h-12 rounded-full bg-[#00ffa31a] flex items-center justify-center flex-shrink-0">
          <img
            className="w-4 h-5 flex-shrink-0"
            alt="SSL Secure"
            src="/svg/ssl-secure.svg"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="[font-family:'Public_Sans',Helvetica] font-bold text-white text-xs tracking-[-0.30px] leading-4 whitespace-nowrap">
            SSL SECURE PAYMENT
          </span>
          <span className="[font-family:'Public_Sans',Helvetica] font-normal text-gray-500 text-[10px] tracking-[0] leading-[15px] whitespace-nowrap">
            Your information is protected by industry-leading encryption
            standards.
          </span>
        </div>
      </div>
    </div>
  );
};
