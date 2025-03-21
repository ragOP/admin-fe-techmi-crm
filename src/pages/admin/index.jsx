import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminsTable from "./components/AdminsTable";
import { useDebounce } from "@uidotdev/usehooks";

const Admins = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };

  const [adminsLength, setAdminsLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    navigate("/dashboard/admins/add");
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
      <NavbarItem title="Admin" handleSearch={handleSearch} />

      <div className="p-4">
        <CustomActionMenu
          title="Admin"
          total={adminsLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <AdminsTable setadminsLength={setAdminsLength} params={params} />
      </div>
    </div>
  );
};

export default Admins;
