import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import CategoriesTable from "./components/CategoriesTable";
import { useNavigate } from "react-router";

const Categories = () => {
  const navigate = useNavigate();
  const [categoryLength, setCategoryLength] = useState(0);
  const [searchText, setSearchText] = useState("");

  const onAdd = () => {
    navigate("/dashboard/categories/add");
  };
  
  return (
    <div className="flex flex-col">
      <NavbarItem title="Categories" />

      <div className="px-4">
        <CustomActionMenu
          title="categories"
          total={categoryLength}
          onAdd={onAdd}
        />
        <CategoriesTable setCategoryLength={setCategoryLength} />
      </div>
    </div>
  );
};

export default Categories;
