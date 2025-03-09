import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavbarItem from "@/components/navbar/navbar_item";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import CategoriesForm from "./components/CategoriesForm";
import { getCategoryById } from "./helper/getCategoryById";

const CategoriesEditor = () => {
  const { id } = useParams();

  const {
    data: initialDataRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title={id ? "Edit Category" : "Add Category"} />
      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <CategoriesForm initialData={initialData} isEditMode={!!id} />
        )}
      </div>
    </div>
  );
};

export default CategoriesEditor;
