import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavbarItem from "@/components/navbar/navbar_item";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import ProductsForm from "./components/ProductForm";
import { getProductById } from "./helper/getProductById";

const ProductsEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  const breadcrumbs = [
    { title: "Products", isNavigation: true, path: "/dashboard/products" },
    { title: id ? "Edit Product" : "Add Product", isNavigation: false },
  ];

  return (
    <div className="flex flex-col gap-2">
      <NavbarItem
        title={id ? "Edit Product" : "Add Product"}
        breadcrumbs={breadcrumbs}
      />
      <div className="px-8 pb-8">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <ProductsForm initialData={initialData} isEditMode={!!id} />
        )}
      </div>
    </div>
  );
};

export default ProductsEditor;
