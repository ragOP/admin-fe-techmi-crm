import NavbarItem from "@/components/navbar/navbar_item";
import ServicesTable from "./components/ServicesTable";

const Services = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Services" />

      <div className="p-4">
         <ServicesTable />
      </div>
    </div>
  );
};

export default Services;
