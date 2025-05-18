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
import { fetchBrand } from "../helpers/fetchBrand";
import { deleteBrand } from "../helpers/deleteBrand";

const BrandsTable = ({ setBrandsLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: brands = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["brands", params],
    queryFn: () => fetchBrand({ params }),
    select: (data) => data?.response?.data?.data,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleOpenDialog = (brand) => {
    setOpenDelete(true);
    setSelectedBrand(brand);
  };

  const handleCloseDialog = () => {
    setOpenDelete(false);
    setSelectedBrand(null);
  };

  const { mutate: deleteBrandMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteBrand,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Brand deleted successfully.");
        queryClient.invalidateQueries(["brands"]);
        handleCloseDialog();
      } else {
        toast.error(res?.response?.data?.message || "Failed to delete brand.");
      }
    },
    onError: () => {
      toast.error("Failed to delete brand.");
    },
  });

  const handleDeleteBrand = (id) => {
    deleteBrandMutation(id);
  };

  const onEditBrand = (brand) => {
    navigate(`/dashboard/brands/edit/${brand._id}`);
  };

  useEffect(() => {
    setBrandsLength(brands?.length || 0);
  }, [brands]);

  const columns = [
    // {
    //   key: "logo_url",
    //   label: "Logo",
    //   render: (value) =>
    //     value ? (
    //       <img
    //         src={value}
    //         alt="Brand Logo"
    //         className="w-10 h-10 object-contain rounded"
    //       />
    //     ) : (
    //       <Typography variant="p" className="text-gray-400 italic">
    //         No Logo
    //       </Typography>
    //     ),
    // },
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
        <span className="text-sm max-w-[20vw] break-words whitespace-normal">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "website",
      label: "Website",
      render: (value) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            {value}
          </a>
        ) : (
          <span className="text-gray-400">—</span>
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
              label: "Edit Brand",
              icon: Pencil,
              action: () => onEditBrand(row),
            },
            {
              label: "Delete Brand",
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
        data={brands}
        isLoading={isLoading}
        error={error}
        emptyStateMessage="No brands available"
      />

      <CustomDialog
        onOpen={openDelete}
        onClose={handleCloseDialog}
        title={`Delete brand "${selectedBrand?.name}"?`}
        description="This will permanently remove the brand and cannot be undone."
        modalType="Delete"
        onDelete={() => handleDeleteBrand(selectedBrand?._id)}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BrandsTable;
