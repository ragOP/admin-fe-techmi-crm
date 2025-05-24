import NavbarItem from "@/components/navbar/navbar_item";
import { useEffect, useState } from "react";
import PrivacyPolicyForm from "./components/PrivacyPolicyForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "./helpers/getPrivacyPolicy";

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const breadcrumbs = [{ title: "Privacy Policy", isNavigation: false }];

  const { data, isLoading } = useQuery({
    queryKey: ["privacy_policy"],
    queryFn: getPrivacyPolicy,
  });

  useEffect(() => {
    if (data?.privacy_policy) {
      console.log("controll reachgnjkn ")
      setIsEdit(true);
      setPrivacyPolicy({ privacy_policy: data.privacy_policy });
    }
  }, [data]);

  const renderForm = () => (
    <div className="px-4">
      <PrivacyPolicyForm id={data?._id} isEdit={isEdit} initialData={privacyPolicy} />
    </div>
  );

  console.log("data", data);

  return (
    <div className="flex flex-col px-6 mb-4">
      <NavbarItem title="Privacy Policy" breadcrumbs={breadcrumbs} />
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default PrivacyPolicy;
