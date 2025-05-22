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
import { useSelector } from "react-redux";
import { selectAdminRole } from "@/redux/admin/adminSelector";

const ProductsTable = ({ setProductLength, params, setParams }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const role = useSelector(selectAdminRole);

  const {
    data: apiProductsResponse = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts({ params, role }),
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

  const onPageChange = (page) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
    // window.scrollTo(0, 0);
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
  const products = apiProductsResponse?.response?.data?.data || [];
  const total = apiProductsResponse?.response?.data?.total || 0;

  const onNavigateToEdit = (service) => {
    navigate(`/dashboard/products/edit/${service._id}`);
  };

  const onNavigateDetails = (service) => {
    navigate(`/dashboard/products/${service._id}`);
  };

  useEffect(() => {
    setProductLength(products?.length);
  }, [products, setProductLength]);

  const perPage = params.per_page;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = params.page;

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.banner_image || row.images?.[0]}
            alt={value}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <Typography variant="p" className="text-wrap w-[15rem]">
            {value}
          </Typography>
        </div>
      ),
    },
    // {
    //   key: "small_description",
    //   label: "Short Description",
    //   render: (value) => (
    //     <Typography variant="p" className="text-sm w-[20rem] text-wrap line-clamp-2">
    //       {value}
    //     </Typography>
    //   ),
    // },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${value}`,
    },
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
    {
      key: "inventory",
      label: "Inventory",
    },
    { key: "manufacturer", label: "Manufacturer" },
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
        data={products || []}
        isLoading={isLoading}
        error={error}
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={onPageChange}
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
