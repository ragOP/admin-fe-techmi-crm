import NavbarItem from "@/components/navbar/navbar_item";
import TestimonialsTable from "./components/TestimonialsTable";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import { useNavigate } from "react-router";

const Testimonials = () => {
  const navigate = useNavigate();

  const [testimonialLength, setTestimonialLength] = useState(0);

  const handleSearch = (e) => setSearchText(e.target.value);
  const onAdd = () => navigate("/dashboard/testimonials/add");

  const breadcrumbs = [{ title: "Testimonials", isNavigation: false }];

  return (
    <div className="flex flex-col">
      <NavbarItem title="Testimonials" breadcrumbs={breadcrumbs} />
      <div className="px-4">
        <CustomActionMenu
          title="testimonials"
          total={testimonialLength}
          onAdd={onAdd}
          handleSearch={handleSearch}
        />
        <TestimonialsTable
          setTestimonialLength={setTestimonialLength}
        />
      </div>
    </div>
  );
};

export default Testimonials;
