import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";

// FAQ data array for easy maintenance and looping
const faqItems = [
  {
    id: "item-1",
    question: "What is the profit share?",
    answer: "UPDOWNX offers up to 90% profit share on all funded accounts. During Stage 1, traders receive 80% of their profits. Once you pass verification and reach a funded account, your share increases to 90%. Profits are calculated at the end of each trading cycle and can be withdrawn directly to your crypto wallet.",
  },
  {
    id: "item-2",
    question: "How long does the verification take?",
    answer: "The verification process typically takes 24–48 hours after you submit your trading results. Our team reviews your trading activity, ensures all rules were followed, and verifies your account details. Once approved, you'll receive an email confirmation and your funded account will be activated immediately.",
  },
  {
    id: "item-3",
    question: "What are the drawdown rules?",
    answer: "We have two drawdown limits to manage risk: a Maximum Daily Loss of 5% of your starting balance, and a Maximum Total Loss of 10% of your starting balance. These limits reset daily at 00:00 UTC. If either limit is breached, the account will be suspended. We calculate drawdowns based on your equity, including unrealized PnL.",
  },
  {
    id: "item-4",
    question: "Which crypto can I trade?",
    answer: "You can trade all major cryptocurrency pairs including BTC/USDT, ETH/USDT, SOL/USDT, XRP/USDT, BNB/USDT, and 50+ other popular trading pairs. We support leverage up to 1:100 on major pairs and 1:50 on altcoins. All trades are executed on our institutional-grade matching engine with deep liquidity.",
  },
];


export const FAQSection = (): JSX.Element => {
  return (
    <section className="flex w-full flex-col items-center px-4 py-16 sm:px-5 lg:py-24">
      <div className="flex w-full max-w-screen-md flex-col items-center gap-10 lg:gap-16">
      {/* Section heading */}
      <div className="flex items-center justify-center w-full">
        <h2 className="[font-family:'Inter',Helvetica] text-center text-3xl font-extrabold leading-tight tracking-[0] text-white sm:text-4xl sm:leading-10">
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ accordion list */}
      <Accordion
        type="single"
        collapsible
        className="flex flex-col gap-4 w-full"
      >
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="bg-[#0b0f14] rounded-2xl border border-solid border-[#1e262f] px-6 py-0 data-[state=open]:pb-4"
          >
            <AccordionTrigger className="flex items-center justify-between w-full py-6 hover:no-underline [&>svg]:text-[#00ffa3] [&>svg]:w-4 [&>svg]:h-4">
              <span className="[font-family:'Inter',Helvetica] font-bold text-white text-base tracking-[0] leading-6 text-left">
                {item.question}
              </span>
            </AccordionTrigger>
            {item.answer && (
              <AccordionContent className="[font-family:'Inter',Helvetica] font-normal text-white/70 text-sm tracking-[0] leading-6">
                {item.answer}
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      </div>
    </section>
  );
};
