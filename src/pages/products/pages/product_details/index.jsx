import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../helpers/fetchProductById";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Typography from "@/components/typography";
import NavbarItem from "@/components/navbar/navbar_item";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [previewImg, setPreviewImg] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product_details", id],
    queryFn: () => fetchProductById({ id }),
    select: (data) => data.response?.data,
    enabled: !!id,
  });

  if (isLoading || !product) {
    return (
      <div className="max-w-4xl mx-auto px-2 py-6">
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="px-8 py-2 space-y-8">
      <NavbarItem title="Products" />

      <Button
        variant="ghost"
        className="flex items-center gap-2 text-sm px-0"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
            <DialogTrigger asChild>
              <img
                src={product.banner_image}
                alt={product.name}
                className="w-full h-[360px] object-cover rounded-xl border cursor-pointer shadow-sm"
                onClick={() => setPreviewImg(product.banner_image)}
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

          <div className="flex flex-col gap-2">
            <Typography variant="h5">Images</Typography>
            <div className="flex gap-2 flex-wrap">
              {product.images?.map((img, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <img
                      src={img}
                      alt={`Extra ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-md border cursor-pointer"
                      onClick={() => setPreviewImg(img)}
                    />
                  </DialogTrigger>
                </Dialog>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">
              {product.name}
            </h1>
            {product.is_best_seller && (
              <Badge variant="secondary">Best Seller</Badge>
            )}
            <Badge variant={product.instock ? "default" : "destructive"}>
              {product.instock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm">
            {product.small_description}
          </p>

          <div className="flex items-center gap-3 text-xl">
            <span className="text-primary font-medium">
              ₹{product.discounted_price}
            </span>
            {product.price !== product.discounted_price && (
              <span className="line-through text-gray-400 text-base">
                ₹{product.price}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Detail label="Manufacturer" value={product.manufacturer} />
            <Detail label="Type" value={product.consumed_type} />
            <Detail label="Brand" value={product.uploaded_by_brand} />
            <Detail
              label="Expiry Date"
              value={
                product.expiry_date
                  ? dayjs(product.expiry_date).format("DD MMM, YYYY")
                  : "N/A"
              }
            />
            <Detail
              label="Created At"
              value={dayjs(product.createdAt).format("DD MMM, YYYY")}
            />
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-1 text-sm">
              Full Description
            </h3>
            <p className="text-gray-600 text-sm">
              {product.full_description || "No description provided."}
            </p>
          </div>

          {product.meta_data?.points &&
            Array.isArray(product.meta_data.points) && (
              <div className="bg-muted/50 p-4 rounded-lg border">
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Key Points
                </h4>
                <ul className="list-disc ml-4 space-y-1 text-xs text-gray-600">
                  {product.meta_data.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-700">{label}:</span>
    <p className="text-gray-600">{value}</p>
  </div>
);

export default ProductDetails;
