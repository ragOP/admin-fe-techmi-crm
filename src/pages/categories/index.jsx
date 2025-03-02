import NavbarItem from "@/components/navbar/navbar_item";
import CategoriesTable from "./components/ProductsTable";

const Categories = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Categories" />

      <div className="p-4">
        <CategoriesTable />
      </div>
    </div>
  );
};

export default Categories;
