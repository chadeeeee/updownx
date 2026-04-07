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
    answer: "",
  },
  {
    id: "item-2",
    question: "How long does the verification take?",
    answer: "",
  },
  {
    id: "item-3",
    question: "What are the drawdown rules?",
    answer: "",
  },
  {
    id: "item-4",
    question: "Which crypto can I trade?",
    answer: "",
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
