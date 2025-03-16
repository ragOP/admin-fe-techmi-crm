import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import { useState } from "react";
import { useNavigate } from "react-router";
import BlogsTable from "./components/BlogsTable";

export const Blogs = () => {
  const navigate = useNavigate();

  const [blogsLength, setBlogsLength] = useState(0);
  const [searchText, setSearchText] = useState("");

  const onAdd = () => {
    navigate("/dashboard/blogs/add");
  };

  return (
    <div className="flex flex-col">
      <NavbarItem title="Blogs" />

      <div className="px-4">
        <CustomActionMenu title="blogs" total={blogsLength} onAdd={onAdd} />
        <BlogsTable setBlogsLength={setBlogsLength} />
      </div>
    </div>
  );
};
