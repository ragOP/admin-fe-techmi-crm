import NavbarItem from "@/components/navbar/navbar_item";
import FaqList from "./components/FaqList";
import { Skeleton } from "@/components/ui/skeleton";

const Faq = () => {
  const breadcrumbs = [{ title: "Faq", isNavigation: false }];

  return (
    <div className="flex flex-col px-6 mb-4">
      <NavbarItem title="Faq" breadcrumbs={breadcrumbs} />
      <FaqList />
    </div>
  );
};

export default Faq;
