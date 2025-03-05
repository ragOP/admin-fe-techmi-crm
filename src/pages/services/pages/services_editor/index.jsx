import NavbarItem from "@/components/navbar/navbar_item";
import ServicesForm from "./components/ServicesForm";

const ServicesEditor = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Services" />
      <div className="px-8 py-4">
        <ServicesForm />
      </div>
    </div>
  );
};

export default ServicesEditor;
