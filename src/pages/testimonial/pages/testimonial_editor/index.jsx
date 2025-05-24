import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NavbarItem from "@/components/navbar/navbar_item";
import TestimonialsForm from "./components/TestimonialForm";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getTestimonialById } from "./helpers/getTestimonialById";

const TestimonialsEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes, isLoading } = useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => getTestimonialById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  const breadcrumbs = [
    { title: "Testimonials", isNavigation: true, path: "/dashboard/testimonials" },
    { title: id ? "Edit testimonial" : "Add testimonial", isNavigation: false },
  ];

  return (
    <div className="flex flex-col gap-0">
      <NavbarItem
        title={id ? "Edit Testimonial" : "Add Testimonial"}
        breadcrumbs={breadcrumbs}
      />
      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <TestimonialsForm initialData={initialData} isEditMode={!!id} />
        )}
      </div>
    </div>
  );
};

export default TestimonialsEditor;
