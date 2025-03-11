import NavbarItem from "@/components/navbar/navbar_item";
import SubAdminForm from "./components/SubAdminForm";

const SubAdminEditor = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Sub Admins" />
      <div className="px-8 py-4">
        <SubAdminForm />
      </div>
    </div>
  );
};

export default SubAdminEditor;
