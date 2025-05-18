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
    per_page: 25,
    search: "",
  };
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);
  const [productLength, setProductLength] = useState(0);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateRangeChange = (range) => {
    if (!range || !range.from || !range.to) {
      setParams((prev) => {
        if (prev.start_date === undefined && prev.end_date === undefined) {
          return prev;
        }
        return { ...prev, start_date: undefined, end_date: undefined };
      });
      return;
    }

    setParams((prev) => {
      const isSame =
        prev.start_date?.toString() === range.from.toString() &&
        prev.end_date?.toString() === range.to.toString();

      if (isSame) return prev;

      return { ...prev, start_date: range.from, end_date: range.to };
    });
  };

  const onAdd = () => {
    navigate("/dashboard/products/add");
  };

  const onRowsPerPageChange = (value) => {
    console.log("Rows per page", value);
    setParams((prev) => ({
      ...prev,
      per_page: value,
    }));
  };

  const breadcrumbs = [{ title: "Products", isNavigation: false }];

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
      <NavbarItem title="Products" breadcrumbs={breadcrumbs} />

      <div className="px-4">
        <CustomActionMenu
          title="products"
          total={productLength}
          onAdd={onAdd}
          setOpenDialog={setOpenDialog}
          disableBulkUpload={false}
          searchText={searchText}
          handleSearch={handleSearch}
          setParams={setParams}
          showDateRangePicker={true}
          handleDateRangeChange={handleDateRangeChange}
          showRowSelection={true}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPage={params.per_page}
        />
        <ProductsTable
          setProductLength={setProductLength}
          params={params}
          setParams={setParams}
        />
        <ExcelUploadDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      </div>
    </div>
  );
};

export default Products;
