import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";
import BrandsTable from "./components/BrandTable";

const Brands = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [brandsLength, setBrandsLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const onAdd = () => {
    navigate("/dashboard/brands/add");
  };

  const onRowsPerPageChange = (newRowsPerPage) => {
    setParams((prev) => ({
      ...prev,
      per_page: newRowsPerPage,
    }));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const breadcrumbs = [{ title: "Brands", isNavigation: false }];

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
      <NavbarItem title="Brands" breadcrumbs={breadcrumbs} />

      <div className="px-4">
        <CustomActionMenu
          title="Brands"
          total={brandsLength}
          onAdd={onAdd}
          handleSearch={handleSearch}
          searchText={searchText}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowSelection={true}
          rowsPerPage={params.per_page}
        />
        <BrandsTable setBrandsLength={setBrandsLength} params={params} />
      </div>
    </div>
  );
};

export default Brands;
