import NavbarItem from "@/components/navbar/navbar_item";
import AnalyticsCards from "./components/AnalyticsCards";
import DashboardCharts from "./components/DashboardCharts";
import { DateRangePicker } from "@/components/date_filter";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudDownload, Printer } from "lucide-react";
import ExportDashboardDialog from "./components/ExportDashboardDialog";
import { useReactToPrint } from "react-to-print";

const Dashboard = () => {
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  const [openBulkExportDialog, setOpenBulkExportDialog] = useState(false);
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

  const onOpenBulkExportDialog = () => {
    setOpenBulkExportDialog(true);
  };

  const onCloseBulkExportDialog = () => {
    setOpenBulkExportDialog(false);
  };

  const CustomBox = () => {
    return (
      <div className="flex flex-row gap-4">
        <Button
          onClick={onOpenBulkExportDialog}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          <CloudDownload />
          <span>Bulk Export</span>
        </Button>
        <Button
          onClick={reactToPrintFn}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          <Printer />
          <span>Print</span>
        </Button>
        <DateRangePicker onChange={handleDateRangeChange} />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <NavbarItem title="Dashboard" customBox={<CustomBox />} />
        <div className="flex flex-col gap-4" ref={contentRef}>
          <AnalyticsCards params={params} />

          <DashboardCharts params={params} />
        </div>
      </div>

      <ExportDashboardDialog
        openDialog={openBulkExportDialog}
        onClose={onCloseBulkExportDialog}
        params={params}
      />
    </>
  );
};

export default Dashboard;
