import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { fetchDashboardOverview } from "../helpers/fetchDashboardOverview";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const ICONS = {
  totalUsers: Users,
  totalOrders: ShoppingCart,
  totalRevenue: DollarSign,
};

const AnalyticsCards = ({ params }) => {
  const { data: overview = {}, isLoading: isFetchingOverview } = useQuery({
    queryKey: ["overview", params],
    queryFn: () => fetchDashboardOverview({ params }),
    select: (data) => data.response?.data,
  });

  const analytics = [
    {
      key: "totalRevenue",
      label: overview.totalRevenue?.label || "Total Revenue",
      value: overview.totalRevenue
        ? `₹${Number(overview.totalRevenue.value).toLocaleString()}`
        : "-",
      change: overview.totalRevenue
        ? `${overview.totalRevenue.changes.trend === "up" ? "+" : ""}${
            overview.totalRevenue.changes.percentage_change
          }%`
        : "-",
      icon: ICONS.totalRevenue,
      trend: overview.totalRevenue?.changes?.trend,
    },
    {
      key: "totalUsers",
      label: overview.totalUsers?.label || "Total Users",
      value: overview.totalUsers?.value ?? "-",
      change: overview.totalUsers
        ? `${overview.totalUsers.changes.trend === "up" ? "+" : ""}${
            overview.totalUsers.changes.percentage_change
          }%`
        : "-",
      icon: ICONS.totalUsers,
      trend: overview.totalUsers?.changes?.trend,
    },
    {
      key: "totalOrders",
      label: overview.totalOrders?.label || "Total Orders",
      value: overview.totalOrders?.value ?? "-",
      change: overview.totalOrders
        ? `${overview.totalOrders.changes.trend === "up" ? "+" : ""}${
            overview.totalOrders.changes.percentage_change
          }%`
        : "-",
      icon: ICONS.totalOrders,
      trend: overview.totalOrders?.changes?.trend,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
      {isFetchingOverview
        ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        : analytics.map((data) => <CardStats key={data.key} {...data} />)}
    </div>
  );
};

export default AnalyticsCards;

function CardStats({ label, value, change, icon: Icon, trend }) {
  const isPositive = trend === "up";

  return (
    <Card className="py-4 shadow-md border gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">{label}</CardTitle>
        <Button variant="outline">
          <Icon className="w-5 h-5 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        <div
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
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton card component
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
