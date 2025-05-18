import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";
import MedicineTypeTable from "./components/MedicineTypeTable";

const MedicineType = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [medicineTypeLength, setMedicineTypeLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const onAdd = () => {
    navigate("/dashboard/medicine-type/add");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onRowsPerPageChange = (newRowsPerPage) => {
    setParams((prev) => ({
      ...prev,
      per_page: newRowsPerPage,
    }));
  };

  const breadcrumbs = [{ title: "Medicine Type", isNavigation: false }];

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
      <NavbarItem title="Medicine Types" breadcrumbs={breadcrumbs} />

      <div className="px-4">
        <CustomActionMenu
          title="Medicine Types"
          total={medicineTypeLength}
          onAdd={onAdd}
          handleSearch={handleSearch}
          searchText={searchText}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowSelection={true}
          rowsPerPage={params.per_page}
        />
        <MedicineTypeTable
          setMedicineTypeLength={setMedicineTypeLength}
          params={params}
        />
      </div>
    </div>
  );
};

export default MedicineType;
