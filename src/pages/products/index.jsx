import NavbarItem from "@/components/navbar/navbar_item";
import ProductsTable from "./components/ProductsTable";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";

const Products = () => {
  const [productLength, setProductLength] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Products" />

      <div className="p-4">
        <CustomActionMenu title="products" total={productLength} />
        <ProductsTable setProductLength={setProductLength} />
      </div>
    </div>
  );
};

export default Products;
