import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";

import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import ActionMenu from "@/components/action_menu";
import { CustomDialog } from "@/components/custom_dialog";
import { fetchMedicineType } from "../helpers/fetchMedicineType";
import { deleteMedicineType } from "../helpers/deleteMedicineType";

const MedicineTypeTable = ({ setMedicineTypeLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: medicineTypes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["medicine-types", params],
    queryFn: () => fetchMedicineType({ params }),
    select: (data) => data?.response?.data?.data,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMedicineType, setSelectedMedicineType] = useState(null);

  const handleOpenDialog = (medicineType) => {
    setOpenDelete(true);
    setSelectedMedicineType(medicineType);
  };

  const handleCloseDialog = () => {
    setOpenDelete(false);
    setSelectedMedicineType(null);
  };

  const { mutate: deleteMedicineTypeMutation, isLoading: isDeleting } =
    useMutation({
      mutationFn: deleteMedicineType,
      onSuccess: (res) => {
        if (res?.response?.success) {
          toast.success("Medicine type deleted successfully.");
          queryClient.invalidateQueries(["medicine-types"]);
          handleCloseDialog();
        } else {
          toast.error(
            res?.response?.data?.message || "Failed to delete medicine type."
          );
        }
      },
      onError: () => {
        toast.error("Failed to delete medicine type.");
      },
    });

  const handleDeleteMedicineType = (id) => {
    deleteMedicineTypeMutation(id);
  };

  const onEditMedicineType = (medicineType) => {
    navigate(`/dashboard/medicine-type/edit/${medicineType._id}`);
  };

  useEffect(() => {
    setMedicineTypeLength(medicineTypes?.length || 0);
  }, [medicineTypes, setMedicineTypeLength]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <Typography variant="p" className="font-medium capitalize">
          {value}
        </Typography>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="text-sm line-clamp-2 overflow-hidden text-ellipsis break-words max-w-xs w-[20vw]">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value, row) => (
        <div>
          <Typography>
            {format(new Date(value), "dd/MM/yyyy hh:mm a")}
          </Typography>
          {value !== row.updatedAt && (
            <Typography className="text-gray-500 text-sm">
              Updated{" "}
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
      render: (_, row) => (
        <ActionMenu
          options={[
            {
              label: "Edit Type",
              icon: Pencil,
              action: () => onEditMedicineType(row),
            },
            {
              label: "Delete Type",
              icon: Trash2,
              action: () => handleOpenDialog(row),
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
        data={medicineTypes}
        isLoading={isLoading}
        error={error}
        emptyStateMessage="No medicine types available"
      />

      <CustomDialog
        onOpen={openDelete}
        onClose={handleCloseDialog}
        title={`Delete medicine type "${selectedMedicineType?.name}"?`}
        description="This will permanently remove the medicine type and cannot be undone."
        modalType="Delete"
        onDelete={() => handleDeleteMedicineType(selectedMedicineType?._id)}
        isLoading={isDeleting}
      />
    </>
  );
};

export default MedicineTypeTable;
