import NavbarItem from "@/components/navbar/navbar_item";
import AnalyticsCards from "./components/AnalyticsCards";
import DashboardCharts from "./components/DashboardCharts";
import { DateRangePicker } from "@/components/date_filter";
import { useState } from "react";
import TopProducts from "./components/TopProducts";

const Dashboard = () => {
  const [params, setParams] = useState({
    start_date: null,
    end_date: null,
  });

  const handleDateRangeChange = (range) => {
    if (!range || !range.from || !range.to) {
      setParams((prev) => {
        if (prev.start_date === undefined && prev.end_date === undefined) {
          return prev;
        }
        return { ...prev, start_date: undefined, end_date: undefined };
      });
      return;
    }

    setParams((prev) => {
      const isSame =
        prev.start_date?.toString() === range.from.toString() &&
        prev.end_date?.toString() === range.to.toString();

      if (isSame) return prev;

      return { ...prev, start_date: range.from, end_date: range.to };
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem
        title="Dashboard"
        customBox={<DateRangePicker onChange={handleDateRangeChange} />}
      />

      <AnalyticsCards params={params} />

      <DashboardCharts params={params} />
    </div>
  );
};

export default Dashboard;
