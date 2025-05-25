import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTestimonials,
  deleteTestimonial,
} from "../helpers/fetchTestimonials";
import { format } from "date-fns";
import CustomTable from "@/components/custom_table";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CustomDialog } from "@/components/custom_dialog";

const TestimonialsTable = ({ setTestimonialLength }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: testimonials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => fetchTestimonials(),
    select: (data) => data?.data,
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast.success("Testimonial deleted.");
      queryClient.invalidateQueries(["testimonials"]);
      setOpenDelete(false);
    },
    onError: () => toast.error("Delete failed."),
  });

  const onDeleteClick = (id) => deleteMutation(id);
  const onEdit = (item) => navigate(`/dashboard/testimonials/edit/${item._id}`);

  const columns = [
    {
      key: "image",
      label: "Author",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img src={row.image} className="w-12 h-12 rounded-full" />
          {/* <Typography>{value}</Typography> */}
        </div>
      ),
    },
    {
      key: "customer_name",
      label: "Customer Name",
      render: (value) => value || "N/A",
    },
    {
      key: "message",
      label: "Message",
      render: (value) =>
        value
          ? value.length > 50
            ? `${value.slice(0, 50)}...`
            : value
          : "N/A",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => format(new Date(value), "dd/MM/yyyy"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <ActionMenu
          options={[
            { label: "Edit", icon: Pencil, action: () => onEdit(row) },
            {
              label: "Delete",
              icon: Trash2,
              action: () => {
                setSelectedTestimonial(row);
                setOpenDelete(true);
              },
              className: "text-red-500",
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    setTestimonialLength(testimonials?.length || 0);
  }, [testimonials, setTestimonialLength]);


  return (
    <>
      <CustomTable
        columns={columns}
        data={testimonials}
        isLoading={isLoading}
        error={error}
      />
      <CustomDialog
        onOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title={selectedTestimonial?.author}
        modalType="Delete"
        onDelete={onDeleteClick}
        id={selectedTestimonial?._id}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TestimonialsTable;
