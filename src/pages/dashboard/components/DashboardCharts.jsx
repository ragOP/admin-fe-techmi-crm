import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchSalesOverview } from "../helpers/fetchSalesOverview";
import { fetchSalesAndOrders } from "../helpers/fetchSalesAndOrders";
import TopProducts from "./TopProducts";

// MultiBarChart component for Sales Overview
const MultiBarChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Sales Overview</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            yAxisId="left"
            dataKey="totalOrders"
            fill="#8884d8"
            name="Total Orders"
            barSize={30}
          />
          <Bar
            yAxisId="right"
            dataKey="totalRevenue"
            fill="#82ca9d"
            name="Total Revenue"
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Example LineChart component
const SalesByMonthLineGraph = ({ data }) => (
  <Card className="flex-1 h-full">
    <CardHeader>
      <CardTitle>Revenue Trend</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto flex-1 flex h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#8884d8"
            name="Total Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Example LineChart component
const OrdersByMonthLineGraph = ({ data }) => (
  <Card className={"flex-1 h-full"}>
    <CardHeader>
      <CardTitle>Order Trend</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto flex-1 flex h-full">
      <ResponsiveContainer width="100%" height={"100%"}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#8884d8"
            name="Total Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
const DashboardCharts = ({ params }) => {
  const { data: salesOverview = [] } = useQuery({
    queryKey: ["sales_overview"],
    queryFn: fetchSalesOverview,
    select: (data) => data.response?.data,
  });

  const salesByMonthParam = {
    year: null,
  };

  const { data: salesByMonth = [] } = useQuery({
    queryKey: ["sales_and_orders", params],
    queryFn: () => fetchSalesOverview({ params: salesByMonthParam }),
    select: (data) => data.response?.data,
  });

  const modifiedSalesByMonth = salesByMonth?.map((it) => ({
    month: it.month,
    totalRevenue: it.totalRevenue,
  }));

  const ordersByMonthParam = {
    year: null,
  };

  const { data: ordersByMonth = [] } = useQuery({
    queryKey: ["sales_and_orders", params],
    queryFn: () => fetchSalesOverview({ params: ordersByMonthParam }),
    select: (data) => data.response?.data,
  });

  const modifiedOrdersByMonth = ordersByMonth?.map((it) => ({
    month: it.month,
    totalOrders: it.totalOrders,
  }));

  console.log("modifiedOrdersByMonth", ordersByMonth, modifiedOrdersByMonth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-4 mb-4 ">
      <div className="flex flex-col flex-1 h-full gap-6">
        <SalesByMonthLineGraph data={modifiedSalesByMonth} />
        <OrdersByMonthLineGraph data={modifiedOrdersByMonth} />
      </div>
      <TopProducts params={params} />
      <div className="col-span-1 md:col-span-2">
        <MultiBarChart data={salesOverview} />
      </div>
    </div>
  );
};

export default DashboardCharts;
