import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "../helpers/fetchProducts";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { CustomDialog } from "@/components/custom_dialog";
import { useEffect, useState } from "react";
import { deleteProduct } from "../helpers/deleteProduct";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const ProductsTable = ({ setProductLength }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: apiProductsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [productData, setProductData] = useState(null);

  const onOpenDialog = (row) => {
    setOpenDelete(true);
    setProductData(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setProductData(null);
  };

  const { mutate: deleteProuductsMutation, isLoading: isDeleting } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        toast.success("Products deleted successfully.");
        queryClient.invalidateQueries(["products"]);
        onCloseDialog();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to delete product.");
      },
    });

  const onDeleteClick = (id) => {
    deleteProuductsMutation(id);
  };

  const products = apiProductsResponse?.data || [];

  const onNavigateToEdit = (service) => {
    navigate(`/dashboard/products/edit/${service._id}`);
  };

  const onNavigateDetails = (service) => {
    navigate(`/dashboard/products/${service._id}`);
  };

  useEffect(() => {
    setProductLength(products?.length);
  }, [products, setProductLength]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.images?.[0] || row.banner_image}
            alt={value}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <Typography variant="p">{value}</Typography>
        </div>
      ),
    },
    { key: "small_description", label: "Short Description" },
    { key: "price", label: "Price", render: (value) => `₹${value}` },
    {
      key: "discounted_price",
      label: "Discounted Price",
      render: (value) => `₹${value}`,
    },
    {
      key: "instock",
      label: "In Stock",
      render: (value) => (value ? "Yes" : "No"),
    },
    { key: "manufacturer", label: "Manufacturer" },
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
        data={products}
        isLoading={isLoading}
        error={error}
      />
      <CustomDialog
        onOpen={openDelete}
        onClose={onCloseDialog}
        title={productData?.name}
        modalType="Delete"
        onDelete={onDeleteClick}
        id={productData?._id}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProductsTable;
