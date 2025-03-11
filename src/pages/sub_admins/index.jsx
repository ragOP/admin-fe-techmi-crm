import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import { useNavigate } from "react-router";
import SubAdminsTable from "./components/SubAdminsTable";

const SubAdmins = () => {
  const navigate = useNavigate();

  const [subAdminsLength, setSubAdminsLength] = useState(0);

  const onAdd = () => {
    navigate("/dashboard/sub-admins/add");
  };

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Sub Admin" />

      <div className="p-4">
        <CustomActionMenu
          title="Sub Admin"
          total={subAdminsLength}
          onAdd={onAdd}
        />
        <SubAdminsTable setSubAdminsLength={setSubAdminsLength} />
      </div>
    </div>
  );
};

export default SubAdmins;
