import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import { useEffect, useState } from "react";
import TermsConditionForm from "./components/TermsConditionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getTermsCondition } from "./helpers/getTermsCondition";

const TermsCondition = () => {
  const [terms, setTerms] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const breadcrumbs = [{ title: "Terms & Conditions", isNavigation: false }];

  const { data, isLoading } = useQuery({
    queryKey: ["terms"],
    queryFn: getTermsCondition,
  });

  useEffect(() => {
    if (data?.terms_and_conditions) {
      setIsEdit(true);
      setTerms({ terms_and_conditions: data.terms_and_conditions });
    }
  }, [data]);

  const renderForm = () => (
    <div className="px-4">
      <TermsConditionForm id={data?._id} isEdit={isEdit} initialData={data} />
    </div>
  );

  return (
    <div className="flex flex-col px-6 mb-4">
      <NavbarItem title="Terms & Conditions" breadcrumbs={breadcrumbs} />
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default TermsCondition;
