import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BlogsTable from "./components/BlogsTable";
import { useDebounce } from "@uidotdev/usehooks";

export const Blogs = () => {
  const navigate = useNavigate();

  const paramInitialState = {
    page: 1,
    per_page: 50,
    search: "",
  };
  const [blogsLength, setBlogsLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState(paramInitialState);

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    navigate("/dashboard/blogs/add");
  };

  useEffect(() => {
    if (params.search !== debouncedSearch) {
      setParams((prev) => ({
        ...prev,
        search: debouncedSearch,
      }));
    }
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col">
      <NavbarItem title="Blogs" />

      <div className="px-4">
        <CustomActionMenu
          title="blogs"
          total={blogsLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
        />
        <BlogsTable setBlogsLength={setBlogsLength} params={params} />
      </div>
    </div>
  );
};
