import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NavbarItem from "@/components/navbar/navbar_item";
import CustomTable from "@/components/custom_table";
import { fetchProductHistoryById } from "./helpers/fetchProductHistoryById";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const actionColors = {
  add: "success",
  remove: "destructive",
  order: "secondary",
  restock: "success",
  manual_adjust: "warning",
  no_change: "muted",
};

const actionLabels = {
  add: "Added",
  remove: "Removed",
  order: "Order",
  restock: "Restocked",
  manual_adjust: "Manual Adjust",
  no_change: "No Change",
};

const columns = [
  {
    key: "createdAt",
    label: "Date",
    render: (value) => dayjs(value).format("DD MMM, YYYY HH:mm"),
  },
  {
    key: "action",
    label: "Action",
    render: (value, row) => {
      if (row.change === 0) {
        return (
          <Badge variant={actionColors.no_change}>
            {actionLabels.no_change}
          </Badge>
        );
      }
      return (
        <Badge variant={actionColors[value] || "default"}>
          {actionLabels[value] || value}
        </Badge>
      );
    },
  },
  {
    key: "change",
    label: "Change",
    render: (value) => (
      <span
        className={
          value > 0
            ? "text-green-600"
            : value < 0
            ? "text-red-500"
            : "text-gray-500"
        }
      >
        {value > 0 ? "+" : ""}
        {value}
      </span>
    ),
  },
  { key: "old_quantity", label: "Old Qty" },
  { key: "new_quantity", label: "New Qty" },
  {
    key: "reason",
    label: "Reason",
    render: (value) => value || "-",
  },
  {
    key: "changed_by",
    label: "Changed By",
    render: (value) => value?.name || "System",
  },
];

const InventoryHistory = () => {
  const { id: productId } = useParams();

  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState({
    page: 1,
    per_page: 50,
    search: "",
  });

  const debouncedSearch = useDebounce(searchText, 500);

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory_history", params],
    queryFn: () => fetchProductHistoryById({ id: productId, params }),
    select: (data) => data.response?.data,
    enabled: !!productId,
  });

  const history = apiData?.data || [];
  const historyTotal = history?.length || 0;

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onRowsPerPageChange = (value) => {
    setParams((prev) => ({
      ...prev,
      per_page: value,
    }));
  };

  const onPageChange = (page) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const breadcrumbs = [
    { title: "Products", path: "/dashboard/products", isNavigation: true },
    { title: "Inventory History", isNavigation: false },
  ];

  const historyLength = history?.length || 0;
  const perPage = params.per_page;
  const totalPages = Math.ceil(historyTotal / perPage);
  const currentPage = params.page;

  useEffect(() => {
    if (params.search !== debouncedSearch) {
      setParams((prev) => ({
        ...prev,
        search: debouncedSearch,
      }));
    }
  }, [debouncedSearch]);

  return (
    <div className="px-8 py-2 space-y-2">
      <NavbarItem title="Inventory History" breadcrumbs={breadcrumbs} />

      {isLoading ? (
        <Skeleton className="w-full h-[300px] rounded-xl" />
      ) : (
        <div className="flex flex-col">
          <CustomActionMenu
            title="inventory history"
            disableAdd={true}
            total={historyLength}
            searchText={searchText}
            handleSearch={handleSearch}
            setParams={setParams}
            showRowSelection={true}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPage={params.per_page}
          />
          <CustomTable
            columns={columns}
            data={history || []}
            isLoading={isLoading}
            error={error}
            totalPages={totalPages}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default InventoryHistory;
