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
    <div className="flex flex-col">
      <NavbarItem title="Sub Admin" />

      <div className="px-4 py-0">
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
