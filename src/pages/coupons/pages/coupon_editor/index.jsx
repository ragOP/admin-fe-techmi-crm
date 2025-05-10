import NavbarItem from "@/components/navbar/navbar_item";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";
import { getCouponById } from "./helper/getCouponById";
import CouponForm from "./components/CouponForm";

const CouponEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes = {}, isLoading } = useQuery({
    queryKey: ["coupons", id],
    queryFn: () => getCouponById({ id }),
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
          <CouponForm initialData={initialData} isEdit={!!id} />
        )}
      </div>
    </div>
  );
};

export default CouponEditor;
