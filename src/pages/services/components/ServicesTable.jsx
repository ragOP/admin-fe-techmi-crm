import { useQuery } from "@tanstack/react-query";
import { deleteService, fetchServices } from "../helpers/fetchServices";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";

const ServicesTable = ({ setServiceLength }) => {
  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [serviceData, setServiceData] = useState(null);

  const onOpenDialog = (row) => {
    console.log("Open Dialog", row);
    setOpenDelete(true);
    setServiceData(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setServiceData(null);
  };

  const onDeleteClick = (id) => {
    console.log("Delete Clicked", id);
    useQuery({
      queryKey: ["delete_services"],
      queryFn: deleteService(id),
    });
  };

  setServiceLength(services?.length);

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
          <Typography>
            {format(new Date(value), "dd/MM/yyyy hh:mm a")}
          </Typography>
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
      render: (value, row) => (
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
              action: () => onOpenDialog(row),
              className: "text-red-500",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={services}
        isLoading={isLoading}
        error={error}
      />
      <CustomDialog
        onOpen={openDelete}
        onClose={onCloseDialog}
        title={serviceData?.name}
        modalType="Delete"
        onDelete={onDeleteClick}
        id={serviceData?._id}
      />
    </>
  );
};

export default ServicesTable;
