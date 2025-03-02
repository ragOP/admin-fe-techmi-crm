import NavbarItem from "@/components/navbar/navbar_item";
import ProductsTable from "./components/ProductsTable";

const Products = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Products" />

      <div className="p-4">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
