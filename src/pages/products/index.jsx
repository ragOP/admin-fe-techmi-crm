import NavbarItem from "@/components/navbar/navbar_item";
import ProductsTable from "./components/ProductsTable";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ExcelUploadDialog from "./components/ExcelUploadDialog";
import { useDebounce } from "@uidotdev/usehooks";

const Products = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);
  const [productLength, setProductLength] = useState(0);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    navigate("/dashboard/products/add");
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
    <div className="flex flex-col gap-4">
      <NavbarItem title="Products" />

      <div className="p-4">
        <CustomActionMenu
          title="products"
          total={productLength}
          onAdd={onAdd}
          setOpenDialog={setOpenDialog}
          disableBulkUpload={false}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <ProductsTable setProductLength={setProductLength} params={params} />
        <ExcelUploadDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      </div>
    </div>
  );
};

export default Products;
