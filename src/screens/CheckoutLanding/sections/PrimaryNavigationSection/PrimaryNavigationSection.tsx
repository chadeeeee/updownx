import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";

export const PrimaryNavigationSection = (): JSX.Element => {
  return (
    <nav className="w-full h-16 flex flex-row items-center justify-between px-[30px] py-2.5 bg-[#0b0f14] border-b border-[#2cf6c3]">
      {/* Logo section */}
      <div className="flex items-center">
        <div className="flex flex-col w-[225px] items-start gap-2.5 p-2.5">
          <img
            className="self-stretch w-full h-[40.29px] object-contain"
            alt="Logo"
            src="/images/logo.png"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="inline-flex items-center gap-3">
        {/* Language selector */}
        <div className="inline-flex items-center gap-1 cursor-pointer">
          <span className="[font-family:'Inter',Helvetica] font-bold text-gray-300 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
            EN
          </span>
          <img className="w-4 h-4" alt="Svg" src="/svg/arrow.svg" />
        </div>

        {/* Notification button */}
        <img
          className="flex-shrink-0 cursor-pointer"
          alt="Nottification button"
          src="/svg/bell.svg"
        />

        {/* User info */}
        <div className="inline-flex items-center gap-3">
          <span className="[font-family:'Inter',Helvetica] font-bold text-[#00ffa3] text-[11.4px] text-right tracking-[-0.40px] leading-4 whitespace-nowrap">
            Alex Trader
          </span>

          {/* Avatar with green border */}
          <div className="w-10 h-10 border border-solid rounded-full border-[#00ffa3] flex items-center justify-center flex-shrink-0">
            <Avatar className="w-[34px] h-[34px]">
              <AvatarImage
                src="/avatar.png"
                alt="Alex Trader"
                className="object-cover"
              />
              <AvatarFallback className="bg-[#00ffa3] text-[#0b0f14] text-xs font-bold">
                AT
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Logout button */}
        <img
          className="w-[18px] h-[16px] cursor-pointer"
          alt="Button log out"
          src="/svg/button-log-out.svg"
        />
      </div>
    </nav>
  );
};
