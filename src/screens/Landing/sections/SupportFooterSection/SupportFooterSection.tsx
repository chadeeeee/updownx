import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { useTranslation } from "../../../../lib/i18n";

const PRIVACY_POLICY_CONTENT = [
  { type: "h1", text: "PRIVACY POLICY" },
  { type: "p", text: "**Effective Date:** [DATE]" },
  { type: "p", text: "**Company:** UPDOWN" },
  { type: "p", text: "**Website:** [updownxpro]" },
  { type: "p", text: "**Contact:** [privacy email address]" },
  { type: "hr" },
  { type: "h2", text: "1. INTRODUCTION" },
  { type: "p", text: "UPDOWN (\"Company,\" \"we,\" \"our,\" or \"us\") is committed to protecting the privacy and personal data of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our trading simulation platform, website, and related services (collectively, the \"Platform\")." },
  { type: "p", text: "We provide a simulated trading environment for educational and skill-development purposes. Users pay for access to our simulation software and trading tools. Any payouts or incentives are discretionary, as detailed in our Payout Policy and Risk Disclosure." },
  { type: "p", text: "This Privacy Policy applies to all personal data collected through our Platform and complies, where applicable, with the UAE Personal Data Protection Law (PDPL), the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other relevant international data protection laws." },
  { type: "p", text: "All terms used in this Privacy Policy shall have the same meanings as defined in our Terms of Use, Payout Policy, and Risk Disclosure, unless otherwise specified." },
  { type: "hr" },
  { type: "h2", text: "2. WHAT DATA WE COLLECT" },
  { type: "h3", text: "2.1. Data You Provide Directly" },
  { type: "p", text: "When you register for an account, participate in a challenge, or contact our support team, we may collect:" },
  { type: "ul", items: ["Full name", "Email address", "Date of birth (for age verification)", "Country of residence", "Payment information (processed by third-party payment providers; we do not store full card or wallet details)", "Any information you provide when communicating with us"] },
  { type: "h3", text: "2.2. Data Collected Automatically" },
  { type: "p", text: "When you access and use our Platform, we automatically collect:" },
  { type: "ul", items: ["**Technical Data:** IP address, browser type and version, operating system, device type, screen resolution", "**Usage Data:** Pages visited, time spent on the Platform, clicks, navigation patterns, feature usage", "**Log Data:** Access times, error logs, referral URLs", "**Transaction Data:** Challenge participation history, simulated trading activity (virtual trades only), performance metrics"] },
  { type: "h3", text: "2.3. Cookies and Similar Technologies" },
  { type: "p", text: "We use cookies and similar tracking technologies to enhance user experience, analyze Platform performance, and prevent fraud. Cookies are small text files stored on your device. You may control cookie settings through your browser, but disabling cookies may affect Platform functionality." },
  { type: "p", text: "Types of cookies we use:" },
  { type: "ul", items: ["**Essential Cookies:** Required for Platform operation (authentication, security)", "**Analytical Cookies:** To understand how users interact with our Platform (e.g., Google Analytics)", "**Preference Cookies:** To remember your settings and preferences"] },
  { type: "h3", text: "2.4. Data from Third Parties" },
  { type: "p", text: "We may receive data about you from:" },
  { type: "ul", items: ["Payment processors (to confirm transaction status, not to obtain full payment details)", "Fraud prevention and verification services", "Analytics providers"] },
  { type: "hr" },
  { type: "h2", text: "3. HOW WE USE YOUR DATA" },
  { type: "p", text: "We process your personal data for the following purposes:" },
  { type: "table", headers: ["Purpose", "Description"], rows: [
    ["Account Registration & Management", "To create and manage your user account, verify your identity, and ensure eligibility for Platform access"],
    ["Providing Platform Services", "To enable access to our simulation environment, challenges, and trading tools"],
    ["Payment Processing", "To process fees for challenge access through third-party payment providers"],
    ["Fraud Prevention & Security", "To detect and prevent unauthorized access, multi-accounting, prohibited trading practices, and other violations of our Terms"],
    ["Service Improvement", "To analyze usage patterns, fix bugs, and improve Platform features and user experience"],
    ["Customer Support", "To respond to your inquiries, resolve issues, and provide technical assistance"],
    ["Legal Compliance", "To comply with applicable laws, regulations, and lawful requests from authorities"],
    ["Communications", "To send you service updates, technical notices, and (with your consent) marketing communications"],
  ]},
  { type: "p", text: "We do **not** use your data for automated decision-making that produces legal effects concerning you." },
  { type: "hr" },
  { type: "h2", text: "4. LEGAL BASIS FOR PROCESSING (GDPR / UAE PDPL)" },
  { type: "p", text: "For users in jurisdictions requiring a legal basis for data processing, we rely on:" },
  { type: "ul", items: ["**Contractual Necessity:** Processing necessary to provide the Platform services you requested", "**Legitimate Interests:** Fraud prevention, security, service improvement, and direct marketing (where permitted)", "**Legal Obligation:** Compliance with tax, anti-money laundering, or other legal requirements", "**Consent:** For marketing communications and certain cookie placements (where required)"] },
  { type: "hr" },
  { type: "h2", text: "5. HOW WE SHARE YOUR DATA" },
  { type: "p", text: "We share your personal data only when necessary and in accordance with this Privacy Policy." },
  { type: "h3", text: "5.1. Service Providers" },
  { type: "p", text: "We may share data with trusted third-party service providers who assist us in operating the Platform:" },
  { type: "ul", items: ["**Payment Processors:** To process challenge fees (e.g., Stripe, PayPal, cryptocurrency payment providers)", "**Hosting & Cloud Providers:** To store and maintain Platform data", "**Analytics Providers:** To analyze Platform usage and improve performance (e.g., Google Analytics)", "**Customer Support Tools:** To manage support tickets and communications"] },
  { type: "p", text: "All service providers are contractually bound to protect your data and may only use it for the specific purposes we authorize." },
  { type: "h3", text: "5.2. Legal and Regulatory Compliance" },
  { type: "p", text: "We may disclose your data if required to do so by law or in response to valid legal requests, including:" },
  { type: "ul", items: ["Subpoenas, court orders, or search warrants", "Compliance with UAE, US, Cyprus, or other applicable laws", "Anti-money laundering (AML) and counter-terrorism financing (CTF) obligations", "Tax reporting requirements"] },
  { type: "h3", text: "5.3. Protection of Rights and Platform Integrity" },
  { type: "p", text: "We may share data to:" },
  { type: "ul", items: ["Investigate and prevent fraud, unauthorized access, or violations of our Terms of Use", "Protect the safety, rights, or property of UPDOWN, our users, or the public"] },
  { type: "h3", text: "5.4. Business Transfers" },
  { type: "p", text: "In the event of a merger, acquisition, restructuring, or sale of our assets, your data may be transferred to the successor entity. We will notify you of any such change and ensure the new entity upholds the commitments in this Privacy Policy." },
  { type: "h3", text: "5.5. Aggregated and Anonymized Data" },
  { type: "p", text: "We may share aggregated or anonymized data that cannot reasonably be used to identify you. This data may be used for research, marketing, or business development purposes." },
  { type: "h3", text: "5.6. User Consent" },
  { type: "p", text: "We will obtain your explicit consent before sharing your data for any purpose not covered in this Privacy Policy." },
  { type: "p", text: "We do **not** sell your personal data to third parties." },
  { type: "hr" },
  { type: "h2", text: "6. DATA RETENTION" },
  { type: "p", text: "We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy and to comply with legal, regulatory, or contractual obligations." },
  { type: "table", headers: ["Data Category", "Retention Period"], rows: [
    ["Account Information", "Duration of active account plus up to 5 years after account closure (for legal and fraud prevention purposes)"],
    ["Transaction & Payment Records", "Minimum of 5 years (to comply with tax and anti-fraud requirements)"],
    ["Technical & Usage Data", "Up to 12 months (for analytics and security)"],
    ["Marketing Data", "Until you withdraw consent or request deletion"],
  ]},
  { type: "p", text: "When data is no longer needed, we will securely delete or anonymize it. Anonymized data may be retained indefinitely for research or analytical purposes." },
  { type: "p", text: "**User Requests for Deletion:** You may request deletion of your personal data at any time. We will process such requests unless we are required to retain the data for:" },
  { type: "ul", items: ["Compliance with legal or regulatory obligations", "Fraud prevention and security purposes", "Resolution of disputes or enforcement of our agreements"] },
  { type: "hr" },
  { type: "h2", text: "7. YOUR RIGHTS AND CHOICES" },
  { type: "p", text: "Depending on your jurisdiction, you may have the following rights regarding your personal data:" },
  { type: "table", headers: ["Right", "Description"], rows: [
    ["**Access**", "Request a copy of the personal data we hold about you"],
    ["**Correction**", "Request correction of inaccurate or incomplete data"],
    ["**Deletion**", "Request deletion of your data (subject to legal retention requirements)"],
    ["**Restriction**", "Request restriction of processing in certain circumstances"],
    ["**Portability**", "Request transfer of your data to another service provider (in machine-readable format)"],
    ["**Objection**", "Object to processing for direct marketing or legitimate interests"],
    ["**Withdraw Consent**", "Withdraw consent for processing based on consent (e.g., marketing)"],
  ]},
  { type: "p", text: "To exercise these rights, contact us at **[privacy email address]**. We will respond within 30 days (or as required by applicable law)." },
  { type: "p", text: "**Opt-Out of Marketing:** You may unsubscribe from marketing emails by clicking the \"unsubscribe\" link in any marketing email or by contacting us directly." },
  { type: "p", text: "**Do Not Track Signals:** Our Platform does not currently respond to \"Do Not Track\" browser signals." },
  { type: "hr" },
  { type: "h2", text: "8. INTERNATIONAL DATA TRANSFERS" },
  { type: "p", text: "Your personal data may be transferred to and processed in countries outside your jurisdiction of residence, including the United States, the European Union, and other countries where our service providers operate." },
  { type: "p", text: "We ensure that appropriate safeguards are in place for such transfers, including:" },
  { type: "ul", items: ["Standard Contractual Clauses (SCCs) approved by the European Commission", "Data processing agreements with service providers", "Compliance with UAE PDPL requirements for cross-border data transfers"] },
  { type: "p", text: "By using our Platform, you acknowledge and consent to the transfer of your data to countries that may have different data protection laws than your country of residence." },
  { type: "hr" },
  { type: "h2", text: "9. DATA SECURITY" },
  { type: "p", text: "We implement reasonable technical, administrative, and physical measures to protect your personal data against unauthorized access, loss, alteration, or disclosure. These measures include:" },
  { type: "ul", items: ["Encryption of data in transit (SSL/TLS)", "Secure storage of passwords (hashed and salted)", "Restricted access to personal data on a need-to-know basis", "Regular security assessments and vulnerability scans"] },
  { type: "p", text: "**However, no method of transmission over the internet or electronic storage is 100% secure.** While we strive to protect your data, we cannot guarantee its absolute security. You use the Platform at your own risk." },
  { type: "p", text: "In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify you and relevant authorities as required by applicable law." },
  { type: "hr" },
  { type: "h2", text: "10. CHILDREN'S PRIVACY" },
  { type: "p", text: "Our Platform is not intended for persons under the age of 18. We do not knowingly collect personal data from anyone under 18. If we become aware that we have collected personal data from a minor without verification of parental consent, we will delete that information promptly. If you believe a minor has provided us with personal data, please contact us." },
  { type: "hr" },
  { type: "h2", text: "11. THIRD-PARTY LINKS" },
  { type: "p", text: "Our Platform may contain links to third-party websites, services, or applications. This Privacy Policy does not apply to those third parties. We are not responsible for the privacy practices or content of third-party sites. We encourage you to review the privacy policies of any third-party services you use." },
  { type: "hr" },
  { type: "h2", text: "12. COOKIE MANAGEMENT" },
  { type: "p", text: "You can control and manage cookies through your browser settings. Most browsers allow you to:" },
  { type: "ul", items: ["See what cookies are stored and delete them", "Block third-party cookies", "Block all cookies", "Clear all cookies when you close your browser"] },
  { type: "p", text: "Please note that disabling essential cookies may prevent you from accessing certain features of our Platform." },
  { type: "p", text: "For more information about cookies, visit www.allaboutcookies.org." },
  { type: "hr" },
  { type: "h2", text: "13. CHANGES TO THIS PRIVACY POLICY" },
  { type: "p", text: "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. We will notify you of material changes by:" },
  { type: "ul", items: ["Posting the updated policy on our website with a new \"Effective Date\"", "Sending an email notification to the address associated with your account (for significant changes)", "Displaying a notice on your dashboard upon login"] },
  { type: "p", text: "Your continued use of the Platform after the effective date of any changes constitutes your acceptance of the updated Privacy Policy." },
  { type: "hr" },
  { type: "h2", text: "14. DISCLAIMER OF LIABILITY" },
  { type: "p", text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, UPDOWN SHALL NOT BE LIABLE FOR:" },
  { type: "ul", items: ["Any unauthorized access to or breach of your personal data that occurs despite our reasonable security measures", "Any indirect, incidental, or consequential damages arising from your use of the Platform or disclosure of your data", "The privacy practices of any third-party websites or services linked from our Platform"] },
  { type: "p", text: "YOU ACKNOWLEDGE THAT YOU PROVIDE YOUR PERSONAL DATA AT YOUR OWN RISK." },
  { type: "hr" },
  { type: "h2", text: "15. GOVERNING LAW" },
  { type: "p", text: "This Privacy Policy shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law principles." },
  { type: "p", text: "Any disputes arising under this Privacy Policy shall be resolved in accordance with the dispute resolution provisions set forth in our Terms of Use." },
  { type: "hr" },
  { type: "h2", text: "16. CONTACT US" },
  { type: "p", text: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:" },
  { type: "p", text: "**UPDOWN**\nEmail: [privacy@updown.com]" },
  { type: "p", text: "For data protection inquiries, you may also contact our designated data protection officer (if applicable) at the same email address." },
  { type: "hr" },
  { type: "p", text: "**Users in the European Union:** You have the right to lodge a complaint with your local supervisory authority if you believe we have violated applicable data protection laws." },
  { type: "p", text: "**Users in California (USA):** Under the CCPA, you have the right to request disclosure of the categories and specific pieces of personal data we have collected, the sources of that data, the business purpose for collection, and the third parties with whom it has been shared. We do not sell your personal data." },
];

const PAYOUT_POLICY_CONTENT: typeof PRIVACY_POLICY_CONTENT = [
  { type: "h1", text: "PAYOUT POLICY – SIMULATION ACCESS & DISCRETIONARY INCENTIVE PROGRAM" },
  { type: "p", text: "**Effective Date:** [DATE]" },
  { type: "p", text: "**Applies to:** All users of UPDOWN trading simulation platform" },
  { type: "hr" },
  { type: "h2", text: "1. Nature of the Platform – Simulation Only" },
  { type: "p", text: "The platform provided by the Company is a simulated trading environment for educational and skill‑development purposes only." },
  { type: "p", text: "All trades, orders, profits, losses, and account balances are virtual / simulated." },
  { type: "p", text: "The Company does not execute real trades on real cryptocurrency markets." },
  { type: "p", text: "No real cryptocurrency or fiat money is ever bought, sold, or held on behalf of the user." },
  { type: "p", text: "The Company is not a cryptocurrency exchange, broker, dealer, custodian, or investment adviser." },
  { type: "hr" },
  { type: "h2", text: "2. What the User Pays For" },
  { type: "p", text: "When a user pays a fee to access a challenge, evaluation, or any trading program, the user receives:" },
  { type: "ul", items: ["Time‑limited access to the Company's simulation software and trading tools", "The ability to test and practice trading strategies in a simulated market environment", "Performance analytics and risk metrics for self‑assessment"] },
  { type: "p", text: "The fee is a payment for access to simulation tools and evaluation services. It is not:" },
  { type: "ul", items: ["an investment", "a deposit", "a wager or entry fee for a gambling or lottery contract", "a purchase of any right to receive future payments"] },
  { type: "p", text: "Fees are non‑refundable under any circumstances, regardless of whether the user receives any discretionary incentive." },
  { type: "hr" },
  { type: "h2", text: "3. Sole Purpose – Trading Experience & Skill Development" },
  { type: "p", text: "The user expressly acknowledges and agrees that the sole purpose of participating in any challenge or evaluation is:" },
  { type: "ul", items: ["to obtain practical trading experience", "to develop risk management discipline", "to test personal trading strategies in a simulated environment"] },
  { type: "p", text: "The Company does not promise, guarantee, or imply any financial reward, payout, or compensation of any kind." },
  { type: "hr" },
  { type: "h2", text: "4. Payouts – Discretionary, Not Owed" },
  { type: "p", text: "The Company may, at its sole and absolute discretion, choose to issue a non‑recurring discretionary incentive to a user who demonstrates exceptional simulated performance." },
  { type: "p", text: "Such an incentive, if any, is:" },
  { type: "ul", items: ["voluntary – the Company has no obligation to issue it", "discretionary – the Company may reduce, delay, cancel, or deny any payout for any reason or no reason", "not a share of real profits (since no real profits exist)", "not wages, salary, commission, or service compensation"] },
  { type: "p", text: "No user shall have any legal or contractual right to demand a payout. The absence of a payout shall not constitute a breach of any agreement." },
  { type: "hr" },
  { type: "h2", text: "5. No Investment Contract / No Security / No Gambling" },
  { type: "p", text: "This agreement and the user's participation do not create under any jurisdiction:" },
  { type: "ul", items: ["an investment contract or security (including under US securities laws, Cyprus ESMA rules, UAE SCA or VARA regulations)", "a derivatives contract", "a wagering contract, lottery, or gambling arrangement", "a deposit‑taking or collective investment scheme", "an employment or independent contractor relationship"] },
  { type: "p", text: "Users are not investing capital with the expectation of profit from the Company's efforts. Users are paying for access to simulation tools – nothing more." },
  { type: "hr" },
  { type: "h2", text: "6. No Fiduciary Duty" },
  { type: "p", text: "The Company does not owe any fiduciary duty (duty of loyalty, care, or good faith) to any user. The Company acts solely as a provider of simulation software and evaluation metrics. Users act independently and at their own risk." },
  { type: "hr" },
  { type: "h2", text: "7. Company Liability Disclaimer (Strongest Version)" },
  { type: "p", text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE LIABLE FOR:" },
  { type: "ul", items: ["any failure or refusal to issue a payout, regardless of the reason", "any delay, reduction, or cancellation of a payout", "any technical errors, data delays, platform downtime, or calculation mistakes", "any user expectation (reasonable or otherwise) of receiving a payment", "any loss of fees paid by the user", "any change in applicable laws or regulations affecting payouts or simulation trading"] },
  { type: "p", text: "THE COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE AVAILABILITY, TIMING, OR AMOUNT OF ANY DISCRETIONARY INCENTIVE." },
  { type: "hr" },
  { type: "h2", text: "8. User Acknowledgment (Binding)" },
  { type: "p", text: "By registering, paying any fee, or accessing the platform, the user irrevocably acknowledges and agrees:" },
  { type: "p", text: "I understand that I am paying for access to a trading simulation and evaluation tools. I am not purchasing any right to receive money. Any payout is entirely optional on the Company's part and is not guaranteed. My sole purpose is to gain trading experience. I will not file any claim, lawsuit, or arbitration against the Company regarding payouts or the return of my fees." },
  { type: "hr" },
  { type: "h2", text: "9. Governing Law & Severability" },
  { type: "p", text: "This Policy shall be governed by the laws of the applicable jurisdiction, excluding conflict‑of‑law rules. If any provision is found unenforceable, the remainder shall remain in full force and effect." },
];

/** Render bold markdown fragments like **text** */
const renderBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const PolicyModal = ({ title, content, onClose }: { title: string; content: typeof PRIVACY_POLICY_CONTENT; onClose: () => void }) => {
  useEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.dataset.scrollY = String(scrollY);
    return () => {
      const savedY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      delete document.body.dataset.scrollY;
      window.scrollTo({ top: savedY, behavior: "instant" });
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overscroll-none" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-[#1e262f] bg-[#0b0f14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e262f] px-6 py-4 shrink-0">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent border border-[#1e262f] text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-4 text-sm leading-relaxed text-gray-400 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
          {content.map((block, i) => {
            switch (block.type) {
              case "h1":
                return <h1 key={i} className="text-2xl font-black text-white tracking-tight">{block.text}</h1>;
              case "h2":
                return <h2 key={i} className="text-lg font-bold text-white pt-2">{block.text}</h2>;
              case "h3":
                return <h3 key={i} className="text-base font-semibold text-gray-200 pt-1">{block.text}</h3>;
              case "p":
                return <p key={i} className="whitespace-pre-line">{renderBold(block.text!)}</p>;
              case "hr":
                return <hr key={i} className="border-[#1e262f] my-2" />;
              case "ul":
                return (
                  <ul key={i} className="list-disc list-inside space-y-1.5 pl-2">
                    {block.items!.map((item, j) => (
                      <li key={j}>{renderBold(item)}</li>
                    ))}
                  </ul>
                );
              case "table":
                return (
                  <div key={i} className="overflow-x-auto rounded-lg border border-[#1e262f]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#1e262f] bg-[#05070a]">
                          {block.headers!.map((h, j) => (
                            <th key={j} className="px-4 py-2.5 font-semibold text-gray-300">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows!.map((row, j) => (
                          <tr key={j} className="border-b border-[#1e262f]/50 last:border-0">
                            {row.map((cell, k) => (
                              <td key={k} className="px-4 py-2.5">{renderBold(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};


export const SupportFooterSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);

  const quickLinks = [
    { label: t("footer.all_challenges"), onClick: undefined },
    { label: t("footer.payout_policy"), onClick: () => setPayoutOpen(true) },
    { label: t("footer.privacy_policy"), onClick: () => setPrivacyOpen(true) },
    { label: t("footer.affiliate_program"), onClick: undefined },
  ];

  const resourceLinks = [
    t("footer.trading_blog"),
    t("footer.help_center"),
    t("footer.discord"),
    t("footer.market_analysis"),
  ];
  return (<>
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
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 hover:text-gray-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-left"
                >
                  {link.label}
                </button>
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

    {privacyOpen && <PolicyModal title="Privacy Policy" content={PRIVACY_POLICY_CONTENT} onClose={() => setPrivacyOpen(false)} />}
    {payoutOpen && <PolicyModal title="Payout Policy" content={PAYOUT_POLICY_CONTENT} onClose={() => setPayoutOpen(false)} />}
  </>);
};
