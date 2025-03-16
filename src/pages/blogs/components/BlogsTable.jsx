import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { fetchBlogs } from "../helpers/fetchBlogs";
import { deleteBlogs } from "../helpers/deleteBlogs";

const BlogsTable = ({ setBlogsLength, params }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: apiBlogsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", params],
    queryFn: () => fetchBlogs({ params }),
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const onOpenDialog = (row) => {
    setOpenDelete(true);
    setSelectedBlog(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setSelectedBlog(null);
  };

  const { mutate: deleteBlogMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteBlogs,
    onSuccess: () => {
      toast.success("Blog deleted successfully.");
      queryClient.invalidateQueries(["blogs"]);
      onCloseDialog();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete blog.");
    },
  });

  const onDeleteClick = (id) => {
    deleteBlogMutation(id);
  };

  const blogs = Array.isArray(apiBlogsResponse?.response?.data)
    ? apiBlogsResponse?.response?.data
    : [];

  useEffect(() => {
    setBlogsLength(blogs?.length);
  }, [blogs, setBlogsLength]);

  const onNavigateToEdit = (blog) => {
    navigate(`/dashboard/blogs/edit/${blog._id}`);
  };

  const onNavigateDetails = (blog) => {
    navigate(`/dashboard/blogs/${blog._id}`);
  };

  const columns = [
    {
      key: "banner",
      label: "Banner",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.bannerImageUrl}
            alt={value}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <Typography variant="p">{value}</Typography>
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value, row) => (
        <div>
          <Typography variant="p">{value}</Typography>
          <Typography
            variant="span"
            className="line-clamp-1 text-gray-500 overflow-hidden text-ellipsis"
          >
            {row.short_description}
          </Typography>
        </div>
      ),
    },
    {
      key: "service",
      label: "Service",
      render: (value, row) => {
        return <Typography variant="p">{row.author?.name}</Typography>;
      },
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "published",
      label: "Published",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value, row) => (
        <div className="flex flex-col gap-1">
          <Typography>
            {format(new Date(value), "dd/MM/yyyy hh:mm a")}
          </Typography>
          {value !== row.updatedAt && (
            <Typography className="text-gray-500 text-sm">
              Updated -{" "}
              {formatDistanceToNow(new Date(row.updatedAt), {
                addSuffix: true,
              })}
            </Typography>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <ActionMenu
          options={[
            {
              label: "View Details",
              icon: Eye,
              action: () => onNavigateDetails(row),
            },
            {
              label: "Edit",
              icon: Pencil,
              action: () => onNavigateToEdit(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              action: () => onOpenDialog(row),
              className: "text-red-500",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={blogs || []}
        isLoading={isLoading}
        error={error}
      />
      <CustomDialog
        onOpen={openDelete}
        onClose={onCloseDialog}
        title={selectedBlog?.title}
        modalType="Delete"
        onDelete={onDeleteClick}
        id={selectedBlog?._id}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BlogsTable;
