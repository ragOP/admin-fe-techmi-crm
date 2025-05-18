import NavbarItem from "@/components/navbar/navbar_item";
import OrdersTable from "./components/OrdersTable";
import { useEffect, useState } from "react";
import CustomActionMenu from "@/components/custom_action";
import { useParams } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";
import OrderStats from "./components/OrderStats";
import { DateRangePicker } from "@/components/date_filter";

const Orders = () => {
  const { serviceId } = useParams();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
    service_id: serviceId,
  };
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);
  const [ordersLength, setOrdersLength] = useState(0);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      service_id: serviceId,
    }));
  }, [serviceId]);

  const onRowsPerPageChange = (newRowsPerPage) => {
    setParams((prev) => ({
      ...prev,
      per_page: newRowsPerPage,
    }));
  };

  const breadcrumbs = [{ title: "Orders", isNavigation: false }];

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
        title="Orders"
        breadcrumbs={breadcrumbs}
        customBox={<DateRangePicker onChange={handleDateRangeChange} />}
      />

      <OrderStats params={params} />

      <div className="px-4">
        <CustomActionMenu
          title="Orders"
          total={ordersLength}
          disableAdd={true}
          searchText={searchText}
          handleSearch={handleSearch}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowSelection={true}
          rowsPerPage={params.per_page}
        />
        <OrdersTable
          setOrdersLength={setOrdersLength}
          params={params}
          setParams={setParams}
        />
      </div>
    </div>
  );
};

export default Orders;
