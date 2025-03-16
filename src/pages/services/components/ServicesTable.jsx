import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteService, fetchServices } from "../helpers/fetchServices";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const ServicesTable = ({ setServiceLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: services,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices({ params }),
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [serviceData, setServiceData] = useState(null);

  const onOpenDialog = (row) => {
    setOpenDelete(true);
    setServiceData(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setServiceData(null);
  };

  const { mutate: deleteServiceMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success("Service deleted successfully.");
      queryClient.invalidateQueries(["services"]);
      onCloseDialog();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete service.");
    },
  });

  const onDeleteClick = (id) => {
    deleteServiceMutation(id);
  };

  const onNavigateToEdit = (service) => {
    navigate(`/dashboard/services/edit/${service._id}`);
  };

  const onNavigateDetails = (service) => {
    navigate(`/dashboard/services/${service._id}`);
  };

  useEffect(() => {
    setServiceLength(services?.length);
  }, [services, setServiceLength]);

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
    { key: "slug", label: "Custom URL" },
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
              action: () => onNavigateDetails(row),
            },
            {
              label: "Edit",
              icon: Pencil,
              action: () => onNavigateToEdit(row),
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
        isLoading={isDeleting}
      />
    </>
  );
};

export default ServicesTable;
