import NavbarItem from "@/components/navbar/navbar_item";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getBrandById } from "./helper/getBrandById";
import BrandForm from "./components/BrandForm";

const BrandEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes = {}, isLoading } = useQuery({
    queryKey: ["brands", id],
    queryFn: () => getBrandById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  const breadcrumbs = [
    { title: "Brands", isNavigation: true, path: "/dashboard/brands" },
    { title: id ? "Edit Brand" : "Add Brand", isNavigation: false },
  ];

  return (
    <div className="flex flex-col">
      <NavbarItem
        title={id ? "Edit Brand" : "Add Brand"}
        breadcrumbs={breadcrumbs}
      />
      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <CustomSpinner />
          </div>
        ) : (
          <BrandForm initialData={initialData} isEdit={!!id} />
        )}
      </div>
    </div>
  );
};

export default BrandEditor;
