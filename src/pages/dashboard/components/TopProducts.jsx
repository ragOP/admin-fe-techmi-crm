import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/pages/products/helpers/fetchProducts";
import { useSelector } from "react-redux";
import { selectAdminRole } from "@/redux/admin/adminSelector";

const dummyTopProducts = [
  {
    _id: "68265ef6588cb51ff16ec407",
    name: "Acetocillin",
    small_description: "The medicine Roche Holding AG",
    price: 100,
    discounted_price: 90,
    banner_image:
      "https://res.cloudinary.com/dacwig3xk/image/upload/v1747346088/uploads/images/ksx0bmp6wwmaqcxjs27v.jpg",
    manufacturer: "Roche Holding AG",
    instock: true,
    reviews: 124,
    rating: 4.5,
  },
  {
    _id: "68265ef6588cb51ff16ec408",
    name: "Panadol Extra",
    small_description: "Pain relief by GSK",
    price: 50,
    discounted_price: 40,
    banner_image:
      "https://res.cloudinary.com/dacwig3xk/image/upload/v1747346086/uploads/images/ktmtvsvjs64kof4rg4u2.jpg",
    manufacturer: "GSK",
    instock: false,
    reviews: 89,
    rating: 4.2,
  },
];

const TopProducts = ({ params }) => {
  const role = useSelector(selectAdminRole);
  const { data: products = [], isLoading: isFetchingProducts } = useQuery({
    queryKey: ["top_products", params],
    queryFn: () => fetchProducts({ params, role }),
    select: (data) => data.response?.data?.data,
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Price</TableHead>
              {/* <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead> */}
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(products) ? (
              products.map((product) => (
                <TableRow
                  key={product._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell>
                    <img
                      src={product.banner_image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {product.name}
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {product.manufacturer}
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-400 line-through mr-2">
                      ₹{product.price}
                    </span>
                    <span className="text-green-600 font-semibold">
                      ₹{product.discounted_price}
                    </span>
                  </TableCell>

                  {/* <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-300" />
                    <span>{product.rating ?? 4.5}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  {product.reviews ?? 0}
                </TableCell> */}
                  <TableCell>
                    <Badge
                      variant={product.inventory > 0 ? "success" : "destructive"}
                    >
                      {product.inventory > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div>No products found</div>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
