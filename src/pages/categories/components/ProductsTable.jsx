import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../helpers/fetchCategories";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";

const CategoriesTable = () => {
  const {
    data: apiCategoriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories = apiCategoriesResponse?.categories || [];

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.images?.[0]}
            alt={value}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <Typography variant="p">{value}</Typography>
        </div>
      ),
    },
    { key: "description", label: "Description" },
    { key: "discount_label_text", label: "Discount Label" },
    { key: "newly_launched", label: "Newly Launched", render: (value) => (value ? "Yes" : "No") },
    { key: "is_active", label: "Active", render: (value) => (value ? "Yes" : "No") },
    {
      key: "createdAt",
      label: "Created At",
      render: (value, row) => (
        <div className="flex flex-col gap-1">
          <Typography>{format(new Date(value), "dd/MM/yyyy hh:mm a")}</Typography>
          {value !== row.updatedAt && (
            <Typography className="text-gray-500 text-sm">
              Updated -{" "}
              {formatDistanceToNow(new Date(row.updatedAt), {
                addSuffix: true,
              })}
            </Typography>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <ActionMenu
          options={[
            {
              label: "View Details",
              icon: Eye,
              action: () => console.log("View Details Clicked"),
            },
            {
              label: "Edit",
              icon: Pencil,
              action: () => console.log("Edit Clicked"),
            },
            {
              label: "Delete",
              icon: Trash2,
              action: () => console.log("Delete Clicked"),
              className: "text-red-500",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={categories}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default CategoriesTable;
