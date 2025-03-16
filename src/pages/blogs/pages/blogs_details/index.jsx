import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchBlogById } from "./helpers/fetchBlogById";
import NavbarItem from "@/components/navbar/navbar_item";

const BlogsDetails = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarItem title="Blogs" />
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

            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {blog.title}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {blog.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-700 mb-8">
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
