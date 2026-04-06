import { DashboardLayout } from "../../components/DashboardLayout";
import { ContentSubsection } from "./sections/ContentSubsection";

export const Payments = (): JSX.Element => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-xl sm:text-2xl tracking-[-0.5px]">
            Payments
          </h1>
          <p className="[font-family:'Inter',Helvetica] font-normal text-gray-400 text-sm">
            Manage your orders and billing history
          </p>
        </div>

        {/* Orders table */}
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <ContentSubsection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
