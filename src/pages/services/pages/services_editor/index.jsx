import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavbarItem from "@/components/navbar/navbar_item";
import ServicesForm from "./components/ServicesForm";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getServiceById } from "./helper/getServiceById";

const ServicesEditor = () => {
  const { id } = useParams();

  const {
    data: initialDataRes,
    isLoading,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

    const breadcrumbs = [
    { title: "Services", isNavigation: true, path: "/dashboard/services" },
    { title: id ? "Edit service" : "Add service", isNavigation: false },
  ]

  return (
    <div className="flex flex-col gap-0">
      <NavbarItem title={id ? "Edit Service" : "Add Service"} breadcrumbs={breadcrumbs} />
      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <ServicesForm initialData={initialData} isEditMode={!!id} />
        )}
      </div>
    </div>
  );
};

export default ServicesEditor;
