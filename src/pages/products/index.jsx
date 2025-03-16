import NavbarItem from "@/components/navbar/navbar_item";
import ProductsTable from "./components/ProductsTable";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import { useNavigate } from "react-router";
import ExcelUploadDialog from "./components/ExcelUploadDialog";

const Products = () => {
  const navigate = useNavigate();
  const [productLength, setProductLength] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const onAdd = () => {
    navigate("/dashboard/products/add");
  };

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
        />
        <ProductsTable setProductLength={setProductLength} />
        <ExcelUploadDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      </div>
    </div>
  );
};

export default Products;
