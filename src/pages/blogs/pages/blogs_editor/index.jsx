import NavbarItem from "@/components/navbar/navbar_item";
import BlogForm from "./components/BlogForm";
import { useParams } from "react-router";
import { fetchBlogById } from "../blogs_details/helpers/fetchBlogById";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "@/components/loaders/CustomSpinner";

const BlogsEditor = () => {
  const { id } = useParams();

  const { data: initialDataRes, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchBlogById(id),
    enabled: !!id,
  });

  const initialData = initialDataRes?.response?.data;

  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Admins" />
      <div className="px-8 py-4">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center ">
            <CustomSpinner />
          </div>
        ) : (
          <BlogForm initialData={initialData} isEdit={!!id} />
        )}
      </div>
    </div>
  );
};

export default BlogsEditor;
