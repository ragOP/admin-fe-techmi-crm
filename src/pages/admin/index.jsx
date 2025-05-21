import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminsTable from "./components/AdminsTable";
import { useDebounce } from "@uidotdev/usehooks";
import { DateRangePicker } from "@/components/date_filter";

const Admins = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 100,
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

  const breadcrumbs = [{ title: "Admins", isNavigation: false }];

  const onRowsPerPageChange = (value) => {
    setParams((prev) => ({
      ...prev,
      per_page: value,
    }));
  };

  const handleDateRangeChange = (range) => {
    if (!range || !range.from || !range.to) {
      setParams((prev) => {
        if (prev.start_date === undefined && prev.end_date === undefined) {
          return prev;
        }
        return { ...prev, start_date: undefined, end_date: undefined };
      });
      return;
    }

    setParams((prev) => {
      const isSame =
        prev.start_date?.toString() === range.from.toString() &&
        prev.end_date?.toString() === range.to.toString();

      if (isSame) return prev;

      return { ...prev, start_date: range.from, end_date: range.to };
    });
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
      <NavbarItem
        title="Admin"
        handleSearch={handleSearch}
        breadcrumbs={breadcrumbs}
        customBox={<DateRangePicker onChange={handleDateRangeChange} />}
      />

      <div className="px-4">
        <CustomActionMenu
          title="Admin"
          total={adminsLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
          showRowSelection={true}
          rowsPerPage={params.per_page}
          onRowsPerPageChange={onRowsPerPageChange}
        />
        <AdminsTable setadminsLength={setAdminsLength} params={params} />
      </div>
    </div>
  );
};

export default Admins;
