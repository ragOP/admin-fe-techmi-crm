import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersOverview } from "../helpers/fetchOrdersOverview";

const ICONS = {
  totalRevenue: DollarSign,
  totalOrders: ShoppingCart,
  totalDelivered: Package,
};

const OrderStats = ({ params }) => {
  const { data: overview = {}, isLoading } = useQuery({
    queryKey: ["order_stats", params],
    queryFn: () => fetchOrdersOverview({ params }),
    select: (data) => data.response?.data?.overview,
  });

  console.log("overview", overview);

  const stats = [
    {
      key: "totalRevenue",
      label: overview.totalRevenue?.label || "Total Revenue",
      value: overview.totalRevenue
        ? `₹${Number(overview.totalRevenue.value).toLocaleString()}`
        : "-",
      // Only show percentage, no up/down or color
      change: overview.totalRevenue ? `${overview.totalRevenue.changes}%` : "-",
      icon: ICONS.totalRevenue,
      // Remove trend for now
      trend: null,
    },
    {
      key: "totalOrders",
      label: overview.totalOrders?.label || "Total Orders",
      value: overview.totalOrders?.value ?? "-",
      change: overview.totalOrders ? `${overview.totalOrders.changes}%` : "-",
      icon: ICONS.totalOrders,
      trend: null,
    },
    {
      key: "totalDelivered",
      label: overview.totalDelivered?.label || "Delivered Orders",
      value: overview.totalDelivered?.value ?? "-",
      change: overview.totalDelivered
        ? `${overview.totalDelivered.changes}%`
        : "-",
      icon: ICONS.totalDelivered,
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
      {isLoading
        ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        : stats.map((data) => <CardStats key={data.key} {...data} />)}
    </div>
  );
};

export default OrderStats;

function CardStats({ label, value, change, icon: Icon, trend }) {
  const isPositive = trend === "up";
  return (
    <Card className="py-4 shadow-md border gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">{label}</CardTitle>
        <div className="bg-muted rounded-full p-2">
          <Icon className="w-6 h-6 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        {/* <div
          className={`text-sm flex items-center ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {change} from last week
        </div> */}
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="py-4 shadow-md border gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </CardContent>
    </Card>
  );
}
