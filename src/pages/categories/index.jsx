import NavbarItem from "@/components/navbar/navbar_item";
import CategoriesTable from "./components/ProductsTable";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";

const Categories = () => {
  const [categoryLength, setCategoryLength] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Categories" />

      <div className="p-4">
        <CustomActionMenu title="categories" total={categoryLength} />
        <CategoriesTable setCategoryLength={setCategoryLength} />
      </div>
    </div>
  );
};

export default Categories;
