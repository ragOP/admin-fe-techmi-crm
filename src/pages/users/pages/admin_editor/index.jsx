import NavbarItem from "@/components/navbar/navbar_item";
import AdminForm from "./components/AdminForm";

const AdminEditor = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Admins" />
      <div className="px-8 py-4">
        <AdminForm />
      </div>
    </div>
  );
};

export default AdminEditor;
