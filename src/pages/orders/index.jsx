import NavbarItem from "@/components/navbar/navbar_item";
import OrdersTable from "./components/OrdersTable";
import { useEffect, useState } from "react";
import CustomActionMenu from "@/components/custom_action";
import { useParams } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

const Orders = () => {
  const { serviceId } = useParams();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
    service_id: serviceId,
  };

  const [ordersLength, setOrdersLength] = useState(0);
  const [params, setParams] = useState(paramInitialState);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      service_id: serviceId,
    }));
  }, [serviceId]);

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
      <NavbarItem title="Orders" />

      <div className="px-4">
        <CustomActionMenu
          title="Orders"
          total={ordersLength}
          disableAdd={true}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <OrdersTable setOrdersLength={setOrdersLength} params={params} />
      </div>
    </div>
  );
};

export default Orders;
