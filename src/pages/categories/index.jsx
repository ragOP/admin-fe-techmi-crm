import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import CategoriesTable from "./components/CategoriesTable";
import { useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

const Categories = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [searchText, setSearchText] = useState("");
  const [categoryLength, setCategoryLength] = useState(0);
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    navigate("/dashboard/categories/add");
  };

  useEffect(() => {
    if (params.search !== debouncedSearch) {
      setParams((prev) => ({
        ...prev,
        search: debouncedSearch,
      }));
    }
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col">
      <NavbarItem title="Categories" />

      <div className="px-4">
        <CustomActionMenu
          title="categories"
          total={categoryLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <CategoriesTable
          setCategoryLength={setCategoryLength}
          params={params}
        />
      </div>
    </div>
  );
};

export default Categories;
