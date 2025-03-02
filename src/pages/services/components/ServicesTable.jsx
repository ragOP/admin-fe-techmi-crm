import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "../helpers/fetchServices";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";

const ServicesTable = () => {
  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.images[0]}
            alt={value}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <Typography variant="p">{value}</Typography>
        </div>
      ),
    },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description" },
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
      data={services}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ServicesTable;
