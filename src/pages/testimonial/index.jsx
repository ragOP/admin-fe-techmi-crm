import NavbarItem from "@/components/navbar/navbar_item";
import TestimonialsTable from "./components/TestimonialsTable";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

const Testimonials = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 25,
    search: "",
  };

  const [testimonialLength, setTestimonialLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onRowsPerPageChange = (newRowsPerPage) => {
    setParams((prev) => ({
      ...prev,
      per_page: newRowsPerPage,
    }));
  };

  const onAdd = () => navigate("/dashboard/testimonials/add");

  const breadcrumbs = [{ title: "Testimonials", isNavigation: false }];

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
      <NavbarItem title="Testimonials" breadcrumbs={breadcrumbs} />
      <div className="px-4">
        <CustomActionMenu
          title="testimonials"
          total={testimonialLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowSelection={true}
          rowsPerPage={params.per_page}
        />
        <TestimonialsTable
          setTestimonialLength={setTestimonialLength}
          params={params}
          setParams={setParams}
        />
      </div>
    </div>
  );
};

export default Testimonials;
