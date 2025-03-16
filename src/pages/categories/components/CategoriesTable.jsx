import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, fetchCategories } from "../helpers/fetchCategories";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CategoriesTable = ({ setCategoryLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: apiCategoriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", params],
    queryFn: () => fetchCategories({ params }),
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

  const { mutate: deleteCategoryMutation, isLoading: isDeleting } = useMutation(
    {
      mutationFn: deleteCategory,
      onSuccess: () => {
        toast.success("Category deleted successfully.");
        queryClient.invalidateQueries(["category"]);
        onCloseDialog();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to delete category.");
      },
    }
  );

  const onDeleteClick = (id) => {
    deleteCategoryMutation(id);
  };

  const categories = Array.isArray(apiCategoriesResponse?.response?.data)
    ? apiCategoriesResponse?.response?.data
    : [];

  console.log(categories);
  useEffect(() => {
    setCategoryLength(categories?.length);
  }, [categories, setCategoryLength]);

  const onNavigateToEdit = (service) => {
    navigate(`/dashboard/categories/edit/${service._id}`);
  };

  const onNavigateDetails = (service) => {
    navigate(`/dashboard/categories/${service._id}`);
  };

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
    {
      key: "newly_launched",
      label: "Newly Launched",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Active",
      render: (value) => (value ? "Yes" : "No"),
    },
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
        data={categories || []}
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

export default CategoriesTable;
