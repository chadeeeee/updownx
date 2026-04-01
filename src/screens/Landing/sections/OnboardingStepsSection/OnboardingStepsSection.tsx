// Data for the onboarding steps
const onboardingSteps = [
  {
    number: "01",
    title: "Register",
    description: (
      <>
        Create your account and
        <br />
        complete your KYC in minutes.
      </>
    ),
  },
  {
    number: "02",
    title: "Choose Assets",
    description: (
      <>
        Select the package and crypto
        <br />
        assets you want to trade.
      </>
    ),
  },
  {
    number: "03",
    title: "Trade",
    description: (
      <>
        Prove your skills by hitting our
        <br />
        targets in the challenge.
      </>
    ),
  },
  {
    number: "04",
    title: "Withdraw",
    description: (
      <>
        Once funded, request your
        <br />
        payouts via USDT or Bank.
      </>
    ),
  },
  {
    number: "05",
    title: "Receive Payouts",
    description: (
      <>
        Get paid within 24 hours of your
        <br />
        withdrawal request.
      </>
    ),
  },
];

export const OnboardingStepsSection = (): JSX.Element => {
  return (
    <section className="flex w-full flex-col items-center bg-[#05070a] py-24 px-8">
      <div className="flex w-full max-w-screen-xl flex-col items-center gap-16">
        {/* Section heading */}
        <div className="flex items-center justify-center w-full">
          <h2 className="[font-family:'Inter',Helvetica] font-extrabold text-white text-4xl text-center tracking-[0] leading-10 whitespace-nowrap">
            How to get Started
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-5 gap-x-[39px] gap-y-8 w-full">
          {onboardingSteps.map((step) => (
            <div
              key={step.number}
              className="relative w-full h-fit flex flex-col items-start"
            >
              {/* Large faded background number */}
              <div className="absolute -top-4 left-0 h-[60px] font-black text-[#ffffff0d] text-6xl leading-[60px] flex items-center [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap select-none">
                {step.number}
              </div>

              {/* Step content */}
              <div className="flex flex-col items-start gap-3 pt-8 pb-0 px-0 relative self-stretch w-full">
                {/* Step title */}
                <div className="flex flex-col items-start relative self-stretch w-full">
                  <h3 className="relative flex items-center self-stretch [font-family:'Inter',Helvetica] font-bold text-white text-xl tracking-[0] leading-7">
                    {step.title}
                  </h3>
                </div>

                {/* Step description */}
                <div className="flex flex-col items-start relative self-stretch w-full">
                  <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
