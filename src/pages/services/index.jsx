import NavbarItem from "@/components/navbar/navbar_item";
import ServicesTable from "./components/ServicesTable";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

const Services = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };

  const [serviceLength, setServiceLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    navigate("/dashboard/services/add");
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
      <NavbarItem title="Services" />

      <div className="p-4">
        <CustomActionMenu
          title="services"
          total={serviceLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <ServicesTable setServiceLength={setServiceLength} params={params} />
      </div>
    </div>
  );
};

export default Services;
