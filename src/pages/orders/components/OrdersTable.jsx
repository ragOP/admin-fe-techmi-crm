import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders } from "../helpers/fetchOrders";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const OrdersTable = ({ setOrdersLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { serviceId } = useParams();

  const {
    data: apiOrdersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders({ params }),
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const onOpenDialog = (row) => {
    setOpenDelete(true);
    setSelectedOrder(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setSelectedOrder(null);
  };

  // const { mutate: deleteOrderMutation, isLoading: isDeleting } = useMutation({
  //   mutationFn: deleteOrder,
  //   onSuccess: () => {
  //     toast.success("Order deleted successfully.");
  //     queryClient.invalidateQueries(["orders"]);
  //     onCloseDialog();
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     toast.error("Failed to delete order.");
  //   },
  // });
  console.log(apiOrdersResponse?.response?.data?.data);
  const orders = Array.isArray(apiOrdersResponse?.response?.data?.data)
    ? apiOrdersResponse?.response?.data?.data
    : [];

  useEffect(() => {
    setOrdersLength(orders?.length);
  }, [orders, setOrdersLength]);

  const onNavigateToEdit = (order) => {
    navigate(`/dashboard/orders/edit/${order._id}`);
  };

  const onNavigateDetails = (order) => {
    navigate(`/dashboard/orders/${order._id}`);
  };

  const columns = [
    { key: "sr_no", label: "Order Id", render: (value, row) => row?._id },
    {
      key: "items",
      label: "Products",
      render: (items) => (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <img
                src={item.product.banner_image}
                alt={item.product.name}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <Typography variant="p" className="font-medium">
                  {item.product.name}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Qty: {item.quantity} · ₹{item.product.discounted_price}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <Badge
          variant={
            status === "delivered"
              ? "success"
              : status === "cancelled"
              ? "destructive"
              : "secondary"
          }
        >
          {status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "address",
      label: "Shipping Info",
      render: (address) => (
        <div className="space-y-1">
          <Typography variant="p" className="font-medium">
            {address.name}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {address.city}, {address.state}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {address.mobile}
          </Typography>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (amount) => (
        <Typography variant="p" className="font-medium">
          ₹{amount.toFixed(2)}
        </Typography>
      ),
    },
    {
      key: "createdAt",
      label: "Order Date",
      render: (date) => format(new Date(date), "dd/MM/yyyy hh:mm a"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, order) => (
        <ActionMenu
          options={[
            // {
            //   label: "View Details",
            //   icon: Eye,
            //   action: () => onNavigateDetails(order),
            // },
            {
              label: "Edit Status",
              icon: Pencil,
              action: () => onNavigateToEdit(order),
            },
            // {
            //   label: "Delete",
            //   icon: Trash2,
            //   action: () => onOpenDialog(order),
            //   className: "text-destructive",
            // },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={orders || []}
        isLoading={isLoading}
        error={error}
      />

      {/* <CustomDialog
        onOpen={openDelete}
        onClose={onCloseDialog}
        title={`Order #${selectedOrder?._id.slice(-6).toUpperCase()}`}
        modalType="Delete"
        onDelete={deleteOrderMutation}
        id={selectedOrder?._id}
        isLoading={isDeleting}
      /> */}
    </>
  );
};

export default OrdersTable;
