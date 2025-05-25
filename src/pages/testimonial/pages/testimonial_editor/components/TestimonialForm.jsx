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
import { Rating } from "react-simple-star-rating";
import { useState } from "react";

const TestimonialsForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [preview, setPreview] = useState(initialData?.image || null);

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
                <Rating
                  allowFraction
                  initialValue={field.value}
                  onClick={(rate) => field.onChange(rate)}
                  size={25}
                  SVGstyle={{ display: "inline-block" }}
                  transition
                />
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
                <div className="space-y-4">
                  {preview && (
                    <img
                      src={
                        typeof preview === "string"
                          ? preview
                          : URL.createObjectURL(preview)
                      }
                      alt="Image Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(file); // update preview
                        form.setValue("image", file); // update form value
                      }
                    }}
                  />
                </div>
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
