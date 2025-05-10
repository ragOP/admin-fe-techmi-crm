import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CouponsTable from "./components/CouponsTable"; // Updated to use CouponsTable
import { useDebounce } from "@uidotdev/usehooks";

const Coupons = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [couponsLength, setCouponsLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const onAdd = () => {
    navigate("/dashboard/coupons/add");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
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
    <div className="flex flex-col">
      <NavbarItem title="Coupons" />

      <div className="py-1 px-4">
        <CustomActionMenu
          title="Coupons"
          total={couponsLength}
          h
          onAdd={onAdd}
          handleSearch={handleSearch}
          searchText={searchText}
        />
        <CouponsTable setCouponsLength={setCouponsLength} params={params} />
      </div>
    </div>
  );
};

export default Coupons;
