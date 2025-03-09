import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import { useNavigate } from "react-router";
import AdminsTable from "./components/AdminsTable";

const Admins = () => {
  const navigate = useNavigate();

  const [adminsLength, setAdminsLength] = useState(0);

  const onAdd = () => {
    navigate("/dashboard/admins/add");
  };

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Admin" />

      <div className="p-4">
        <CustomActionMenu
          title="Admin"
          total={adminsLength}
          onAdd={onAdd}
        />
        <AdminsTable setadminsLength={setAdminsLength} />
      </div>
    </div>
  );
};

export default Admins;
