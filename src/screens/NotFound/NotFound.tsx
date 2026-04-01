import { Link } from "react-router-dom";

export const NotFound = (): JSX.Element => {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#02060c] text-white">
      {/* BG texture */}
      <img
        src="/images/bg-lines.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <img
        src="/images/bg-lines1.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-11 mix-blend-screen"
      />


      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00ffa3]/8 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00ffa3]/6 blur-[120px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center px-5 text-center">
        {/* Chart icon card */}
        <div className="mb-4 flex h-[120px] w-[180px] items-end justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#0e3d43]/80 to-[#082a30]/60 p-5 shadow-[0_8px_32px_rgba(0,255,163,0.08)]">
          <div className="h-[50px] w-[14px] rounded-sm bg-[#00ffa3]/70" />
          <div className="h-[70px] w-[14px] rounded-sm bg-[#00ffa3]" />
          <div className="h-[40px] w-[14px] rounded-sm bg-[#ff4d4d]/80" />
          <div className="h-[55px] w-[14px] rounded-sm bg-[#ff4d4d]" />
          <div className="h-[65px] w-[14px] rounded-sm bg-[#00ffa3]" />
          <div className="h-[30px] w-[14px] rounded-sm bg-[#00ffa3]/60" />
        </div>

        {/* Trend icon */}
        <svg
          className="mb-6 text-[#00ffa3]"
          width="40"
          height="28"
          viewBox="0 0 40 28"
          fill="none"
        >
          <path
            d="M2 22L12 12L18 18L28 6M28 6H22M28 6V12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
          <path d="M37 23L39 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <h1 className="text-[42px] font-bold leading-tight tracking-tight">
          Sorry, this page is available
          <br />
          only to traders.
        </h1>

        <p className="mt-4 max-w-[460px] text-base leading-relaxed text-[#6e8188]">
          Traders are individuals who have successfully completed the Evaluation
          Process and manage a Hash Hedge trading account.
        </p>

        <Link
          to="/challenge"
          className="mt-10 inline-block rounded-xl bg-[#00FFA3] px-10 py-3.5 text-lg font-bold text-black transition-all hover:bg-[#00e895] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
        >
          New challenge
        </Link>
      </section>

      {/* Bottom-left support widget */}
      <div className="absolute bottom-8 left-8 z-10 rounded-2xl border border-[#1a4540] bg-[#0a2420]/90 px-5 py-4 backdrop-blur-sm">
        <p className="mb-2 text-sm text-[#a0c2b8]">Need assistance?</p>
        <button className="rounded-xl border border-[#00FFA3] bg-[#00FFA3]/10 px-6 py-2 text-sm font-semibold text-[#00FFA3] transition-colors hover:bg-[#00FFA3]/20">
          Contact Support
        </button>
      </div>
    </main>
  );
};
