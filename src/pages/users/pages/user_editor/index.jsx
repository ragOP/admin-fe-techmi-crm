import NavbarItem from "@/components/navbar/navbar_item";
import UserForm from "./components/UserForm";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getUserById } from "./helper/getUserById";

const UserEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getUserById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="User" />
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <UserForm initialData={initialData} isEdit={!!id} />
        )}
      </div>
    </div>
  );
};

export default UserEditor;
