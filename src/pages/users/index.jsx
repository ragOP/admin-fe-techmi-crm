import NavbarItem from "@/components/navbar/navbar_item";
import CustomActionMenu from "@/components/custom_action";
import { useState } from "react";
import { useNavigate } from "react-router";
import UsersTable from "./components/UsersTable";

const Users = () => {
  const navigate = useNavigate();

  const [usersLength, setUsersLength] = useState(0);

  const onAdd = () => {
    navigate("/dashboard/users/add");
  };

  return (
    <div className="flex flex-col">
      <NavbarItem title="Users" />

      <div className="py-1 px-4">
        <CustomActionMenu
          title="Users"
          total={usersLength}
          onAdd={onAdd}
        />
        <UsersTable setUsersLength={setUsersLength} />
      </div>
    </div>
  );
};

export default Users;
