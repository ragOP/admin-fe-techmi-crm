import NavbarItem from "@/components/navbar/navbar_item";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getMedicineTypeById } from "./helper/getMedicineTypeById";
import MedicineTypeForm from "./components/MedicineTypeForm";

const MedicineTypeEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes = {}, isLoading } = useQuery({
    queryKey: ["medicine-types", id],
    queryFn: () => getMedicineTypeById({ id }),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title={id ? "Edit Medicine Type" : "Add Medicine Type"} />
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <CustomSpinner />
          </div>
        ) : (
          <MedicineTypeForm initialData={initialData} isEdit={!!id} />
        )}
      </div>
    </div>
  );
};

export default MedicineTypeEditor;
