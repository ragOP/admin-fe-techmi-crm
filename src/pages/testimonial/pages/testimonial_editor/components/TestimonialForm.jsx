import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TestimonialsFormSchema } from "../schema/testimonialFormSchema";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { createTestimonial } from "../helpers/createTestimonial";
import { updateTestimonial } from "../helpers/updateTestimonial";
import RatingCard from "@/pages/testimonial/components/RatingCard";

const TestimonialsForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(TestimonialsFormSchema),
    defaultValues: {
      customer_name: initialData?.customer_name || "",
      message: initialData?.message || "",
      rating: initialData?.rating || 0,
      image: initialData?.image || null,
    },
  });

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Testimonial created successfully.");
        navigate("/dashboard/testimonials");
      } else toast.error("Failed to create testimonial.");
    },
    onError: () => toast.error("Failed to create testimonial."),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTestimonial({ id, payload: data }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Testimonial updated successfully.");
        navigate("/dashboard/testimonials");
      } else toast.error("Failed to update testimonial.");
    },
    onError: () => toast.error("Failed to update testimonial."),
  });

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
  formData.append("customer_name", data.customer_name);
  formData.append("message", data.message);
  formData.append("rating", String(data.rating));
  if (data.image instanceof File) {
    formData.append("image", data.image); // only append if it's a File
  }
    if (isEditMode) updateMutation.mutate(formData);
    else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input placeholder="Enter message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                {/* <Textarea placeholder="Enter rating" {...field} /> */}
                <RatingCard value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    form.setValue("image", file); // manually set value
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Testimonial"
            : "Create Testimonial"}
        </Button>
      </form>
    </Form>
  );
};

export default TestimonialsForm;
