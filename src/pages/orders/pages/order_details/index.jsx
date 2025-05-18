import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Typography from "@/components/typography";
import NavbarItem from "@/components/navbar/navbar_item";
// import fetchOrderById from your helpers
import { fetchOrderById } from "../../helpers/fetchOrderById";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [previewImg, setPreviewImg] = useState(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order_details", id],
    queryFn: () => fetchOrderById({ orderId: id }),
    select: (data) => data.response?.data,
    enabled: !!id,
  });

  if (isLoading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-2 py-6">
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  const breadcrumbs = [
    { title: "Orders", navigate: "/dashboard/orders", isNavigation: true },
    {
      title: order?.cashfree_order?.id || order._id,
      navigate: "",
      isNavigation: true,
    },
  ];

  return (
    <div className="px-8 py-2 space-y-2">
      <NavbarItem title={"Orders"} breadcrumbs={breadcrumbs} />

      <Button
        variant="ghost"
        className="flex items-center gap-2 text-sm px-0 mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4">
        {/* Order Items */}
        <div className="flex flex-col gap-4">
          <Typography variant="h5" className="mb-2">
            Order Items
          </Typography>
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 items-center bg-muted/50 rounded-lg p-4 border shadow-sm mb-2"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={item.product.banner_image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
                    onClick={() => setPreviewImg(item.product.banner_image)}
                  />
                </DialogTrigger>
                <DialogContent className="p-0 max-w-xl">
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="rounded-md w-full object-contain max-h-[80vh]"
                  />
                </DialogContent>
              </Dialog>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Typography variant="h6">{item.product.name}</Typography>
                  <Badge variant="outline" className="text-xs">
                    Qty: {item.quantity}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-lg">
                  <span className="text-primary font-semibold">
                    ₹{item.product.discounted_price}
                  </span>
                  {item.product.price !== item.product.discounted_price && (
                    <span className="line-through text-gray-400 text-base">
                      ₹{item.product.price}
                    </span>
                  )}
                  {item.product.price !== item.product.discounted_price && (
                    <Badge variant="secondary" className="ml-2">
                      {Math.round(
                        ((item.product.price - item.product.discounted_price) /
                          item.product.price) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Item Total: ₹{item.product.discounted_price * item.quantity}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-muted/50 rounded-lg p-4 border mt-4">
            <Typography variant="h6" className="mb-2">
              Order Summary
            </Typography>
            <div className="flex flex-col gap-2 text-sm">
              <SummaryRow label="Subtotal">
                ₹
                {order.items
                  .reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                  )
                  .toLocaleString()}
              </SummaryRow>
              <SummaryRow label="Discount">
                - ₹
                {order.items
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.product.price - item.product.discounted_price) *
                        item.quantity,
                    0
                  )
                  .toLocaleString()}
              </SummaryRow>
              <SummaryRow label="Total" bold>
                ₹{order.totalAmount?.toLocaleString()}
              </SummaryRow>
              {order.discountedPriceAfterCoupon > 0 && (
                <SummaryRow label="Coupon Discount">
                  - ₹{order.discountedPriceAfterCoupon}
                </SummaryRow>
              )}
              <SummaryRow label="Order Status">
                <Badge
                  variant={
                    order.status === "shipped"
                      ? "secondary"
                      : order.status === "delivered"
                      ? "default"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </SummaryRow>
              <SummaryRow label="Order Date">
                {dayjs(order.createdAt).format("DD MMM, YYYY hh:mm A")}
              </SummaryRow>
              <SummaryRow label="Last Updated">
                {dayjs(order.updatedAt).format("DD MMM, YYYY hh:mm A")}
              </SummaryRow>
              <SummaryRow label="Order ID">
                {order.cashfree_order?.id}
              </SummaryRow>
            </div>
          </div>
        </div>

        {/* Address & User Info */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <Typography variant="h6" className="mb-2">
              Shipping Address
            </Typography>
            <div className="text-sm text-gray-700">
              <div>
                <span className="font-medium">Name:</span> {order.address?.name}
              </div>
              <div>
                <span className="font-medium">Mobile:</span>{" "}
                {order.address?.mobile}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {order.address?.address}, {order.address?.locality}
              </div>
              <div>
                <span className="font-medium">City:</span> {order.address?.city}
              </div>
              <div>
                <span className="font-medium">State:</span>{" "}
                {order.address?.state}
              </div>
              <div>
                <span className="font-medium">Pincode:</span>{" "}
                {order.address?.pincode}
              </div>
              {order.address?.landmark && (
                <div>
                  <span className="font-medium">Landmark:</span>{" "}
                  {order.address.landmark}
                </div>
              )}
              {order.address?.alternatePhone && (
                <div>
                  <span className="font-medium">Alternate Phone:</span>{" "}
                  {order.address.alternatePhone}
                </div>
              )}
              <div>
                <span className="font-medium">Type:</span>{" "}
                {order.address?.addressType}
              </div>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <Typography variant="h6" className="mb-2">
              Customer Info
            </Typography>
            <div className="text-sm text-gray-700">
              <div>
                <span className="font-medium">User ID:</span> {order.user}
              </div>
              {/* Add more user info here if available */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, children, bold }) => (
  <div className="flex justify-between items-center">
    <span className={`text-gray-700 ${bold ? "font-semibold" : ""}`}>
      {label}
    </span>
    <span className={bold ? "font-semibold text-primary" : ""}>{children}</span>
  </div>
);

export default OrderDetails;
