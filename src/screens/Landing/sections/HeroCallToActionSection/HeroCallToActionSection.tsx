import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'

// Stat cards data
const statCards = [
  {
    icon: '/svg/container-1.svg',
    title: '160+ Assets',
    subtitle: 'Crypto, Stocks, Forex',
  },
  {
    icon: '/svg/container-2.svg',
    title: '24/7 Support',
    subtitle: 'Always here to help',
  },
  {
    icon: '/svg/container-3.svg',
    title: '80% Profit Share',
    subtitle: 'Industry leading payouts',
  },
  {
    icon: '/svg/container-4.svg',
    title: '5x Leverage',
    subtitle: 'Amplify your trades',
  },
]

export const HeroCallToActionSection = (): JSX.Element => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-full h-full top-0 left-0 flex justify-between pointer-events-none">
        <div className="mt-[-120px] ml-[-120px] h-[320px] w-[320px] rounded-full bg-[#00ffa31a] blur-[60px] sm:ml-8 sm:h-[420px] sm:w-[420px] lg:ml-36 lg:h-[500px] lg:w-[500px]" />
        <div className="mb-[-120px] mr-[-120px] h-[320px] w-[320px] self-end rounded-full bg-[#2cf6c31a] blur-[60px] sm:mr-8 sm:h-[420px] sm:w-[420px] lg:mr-36 lg:h-[500px] lg:w-[500px]" />
      </div>

      {/* Main content */}
      <div className="relative flex w-full flex-col items-center gap-8 px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:px-20 lg:pt-28">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-solid border-[#ffffff1a] bg-[#ffffff0d] px-3 py-2 sm:px-4">
          <div className="w-2 h-2 bg-[#00ffa3] rounded-full flex-shrink-0" />
          <span className="[font-family:'Inter',Helvetica] text-center text-[10px] font-bold leading-4 tracking-[1.20px] text-[#2cf6c3] sm:text-xs">
            REVOLUTIONIZING CRYPTO TRADING
          </span>
        </div>

        {/* Headline + subtitle + CTA */}
        <div className="flex flex-col items-center gap-10 w-full max-w-[1216px]">
          {/* Headline + subtitle */}
          <div className="flex w-full max-w-[950px] flex-col items-center gap-6">
            <h1 className="[font-family:'Inter',Helvetica] px-1 text-center text-4xl font-black uppercase leading-[1.0] tracking-tighter text-white sm:px-5 sm:text-5xl lg:text-6xl">
              TRADE PROFITABLY
              <br />
              WITHOUT <span className="text-[#00ffa3]">RISKING</span> YOUR
              <br />
              CAPITAL
            </h1>

            <p className="[font-family:'Inter',Helvetica] max-w-[760px] text-center text-base font-normal leading-relaxed tracking-tight text-gray-400 sm:text-lg lg:text-xl">
              Trade over 160+ crypto assets with up to 1:5 leverage. Prove your skills and manage up to $100,000 of our liquidity.
            </p>
          </div>

          {/* CTA buttons row */}
          <div className="flex w-full flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Choose Your Account button */}
            <Button 
              onClick={() => window.location.href = '/accounts'}
              className="inline-flex h-[64px] w-full items-center justify-center rounded-2xl border border-white/5 bg-[#1a1d1f] px-10 hover:bg-[#23272a] sm:w-auto"
            >
              <span className="font-bold text-[#00ffa3] text-sm uppercase leading-6 [font-family:'Inter',Helvetica] text-center tracking-widest whitespace-nowrap">
                CHOOSE YOUR ACCOUNT
              </span>
            </Button>

            {/* Trade button */}
            <Button 
              onClick={() => window.location.href = '/trading'}
              className="inline-flex h-[64px] w-full items-center justify-center rounded-2xl border-0 bg-[#00ffa3] px-16 hover:bg-[#00ffa3]/90 sm:w-auto"
            >
              <span className="font-bold text-[#05070a] text-sm uppercase leading-6 [font-family:'Inter',Helvetica] text-center tracking-widest whitespace-nowrap">
                TRADE
              </span>
            </Button>
          </div>

          {/* Trustpilot widget */}
          <div className="inline-flex h-[64px] items-center gap-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] py-2 pl-4 pr-6 backdrop-blur-xl">
            <div className="flex -space-x-3 overflow-hidden">
               <img className="inline-block h-9 w-9 rounded-full object-cover ring-2 ring-[#05070a]" src="/images/user-1.png" alt="user" />
               <img className="inline-block h-9 w-9 rounded-full object-cover ring-2 ring-[#05070a]" src="/images/user-2.png" alt="user" />
               <img className="inline-block h-9 w-9 rounded-full object-cover ring-2 ring-[#05070a]" src="/images/user-3.png" alt="user" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#FFB800">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.175 0l-3.367 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
              <div className="text-[11px] font-normal text-gray-500">
                <span className="font-bold text-white/90">Trustpilot 4.9/5 </span> Rating
              </div>
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="block lg:hidden w-full">
          <MobileStatsCarousel />
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 w-full">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="relative flex h-[140px] flex-col items-center justify-center gap-1 rounded-[16px] 
                       border border-white/5 
                       bg-white/[0.02] 
                       backdrop-blur-xl 
                       p-[25px] 
                       transition-all duration-300 
                       hover:bg-white/[0.05] hover:border-[#00ffa3]/20"
            >
              <CardContent className="flex flex-col items-center justify-center p-0 w-full h-full">
                <div className="absolute top-[22px] left-[24px]">
                  <img className="h-6 w-6" alt="Icon" src={card.icon} />
                </div>

                <div className="flex flex-col items-center mt-2">
                  <span className="text-center font-sans text-xl font-bold leading-7 text-white tracking-tight">
                    {card.title}
                  </span>
                  <span className="text-center font-sans text-sm font-normal leading-5 text-gray-500 mt-1">
                    {card.subtitle}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Mobile carousel component - always scrolls right
function MobileStatsCarousel() {
  const [activePage, setActivePage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const totalPages = Math.ceil(statCards.length / 2);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create pages with a clone of first page at the end for seamless loop
  const pages = Array.from({ length: totalPages + 1 }).map((_, i) => {
    const realIndex = i % totalPages;
    return statCards.slice(realIndex * 2, realIndex * 2 + 2);
  });

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setIsTransitioning(true);
      setActivePage((prev) => prev + 1);
    }, 3000);
  }, []);

  // When reaching the clone page, snap back instantly
  useEffect(() => {
    if (activePage === totalPages) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setActivePage(0);
      }, 500); // wait for transition to finish
      return () => clearTimeout(timeout);
    }
  }, [activePage, totalPages]);

  // Re-enable transition after instant snap
  useEffect(() => {
    if (!isTransitioning && activePage === 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning, activePage]);

  // Auto-scroll
  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [startAutoScroll]);

  const handleDotClick = (page: number) => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    setIsTransitioning(true);
    setActivePage(page);
    startAutoScroll();
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Sliding container */}
      <div
        className="flex"
        style={{
          transform: `translateX(-${activePage * 100}%)`,
          transition: isTransitioning ? 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
        }}
      >
        {pages.map((pageCards, pageIndex) => (
          <div
            key={pageIndex}
            className="flex w-full flex-shrink-0 gap-3 px-1"
          >
            {pageCards.map((card, cardIndex) => (
              <Card
                key={cardIndex}
                className="relative flex h-[160px] w-[calc(50%-6px)] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-[16px]
                         border border-white/5
                         bg-white/[0.02]
                         backdrop-blur-xl
                         p-[20px]"
              >
                <CardContent className="flex flex-col items-center justify-center p-0 w-full h-full">
                  <div className="absolute top-[18px] left-[18px]">
                    <img className="h-6 w-6" alt="Icon" src={card.icon} />
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-center font-sans text-lg font-bold leading-6 text-white tracking-tight">
                      {card.title}
                    </span>
                    <span className="text-center font-sans text-xs font-normal leading-4 text-gray-500 mt-1">
                      {card.subtitle}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              (activePage % totalPages) === index
                ? 'bg-[#00ffa3]'
                : 'bg-[#1e262f]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
