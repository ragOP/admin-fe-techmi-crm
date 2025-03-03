import NavbarItem from "@/components/navbar/navbar_item";
import ServicesTable from "./components/ServicesTable";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";

const Services = () => {
  const [serviceLength, setServiceLength] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Services" />

      <div className="p-4">
        <CustomActionMenu title="services" total={serviceLength} />
         <ServicesTable setServiceLength={setServiceLength} />
      </div>
    </div>
  );
};

export default Services;
