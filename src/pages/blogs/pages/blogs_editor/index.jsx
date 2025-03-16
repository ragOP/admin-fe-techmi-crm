import NavbarItem from "@/components/navbar/navbar_item";
import BlogForm from "./components/BlogForm";

const BlogsEditor = () => {
  return (
    <div className="flex flex-col gap-4">
      <NavbarItem title="Admins" />
      <div className="px-8 py-4">
        <BlogForm />
      </div>
    </div>
  );
};

export default BlogsEditor;
