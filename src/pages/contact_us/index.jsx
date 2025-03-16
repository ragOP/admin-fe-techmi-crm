import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import { useState } from "react";
import { useNavigate } from "react-router";
import ContactUsTable from "./components/ContactUsTable";

export const ContactUs = () => {
  const navigate = useNavigate();

  const [contactUsLength, setContactUsLength] = useState(0);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex flex-col">
      <NavbarItem title="Contact Us" />

      <div className="px-4">
        <CustomActionMenu
          title="Contact us"
          total={contactUsLength}
          disableAdd={true}
        />
        <ContactUsTable setContactUsLength={setContactUsLength} />
      </div>
    </div>
  );
};
