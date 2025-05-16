import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { fetchBlogById } from "./helpers/fetchBlogById";
import NavbarItem from "@/components/navbar/navbar_item";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: blogRes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogById(id),
  });

  const blog = blogRes?.response?.data;

  const breadcrumbs = [
    { title: "Blog", navigate: "/dashboard/blogs", isNavigation: true },
    { title: blog.title, navigate: "/dashboard/blogs", isNavigation: true },
  ];

  return (
    <div className="min-h-screen">
      <NavbarItem title={"Blogs"} breadcrumbs={breadcrumbs} />

      <Button
        variant="ghost"
        className="flex items-center gap-2 text-sm px- ml-10"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Button>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <img
                src={blog.bannerImageUrl}
                alt={blog.title}
                className="w-full h-70 object-cover rounded-lg shadow-lg"
              />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {blog.title}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div>
                  <p className="text-sm font-medium text-gray-700  dark:text-gray-100">
                    {blog.author.name}
                  </p>
                  <p className="text-xs text-gray-500  dark:text-gray-100">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-700 mb-8  dark:text-gray-100">
              {blog.short_description}
            </p>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            {/* Published Status */}
            <div className="mt-8">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  blog.published
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {blog.published ? "Published" : "Unpublished"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsDetails;
