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
import { ServicesFormSchema } from "@/pages/services/schema/serviceFormSchema";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createService } from "../helper/createService";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ServicesForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(ServicesFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      meta_data: {},
      images: [],
    },
  });
  const { watch, formState } = form;
  const allFields = watch();

  useEffect(() => {
    console.log("Form Fields Updated >>>>>", allFields);
  }, [allFields]);

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      toast.success("Service created successfully.");
      form.reset();
      navigate("/dashboard/services");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create service. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("created_by_admin", "67b978d65929dad694e2a5d9");

    data.images.forEach((file) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter service name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Slug Field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter custom link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter service description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Meta Data Field */}
        {/* <FormField
          control={form.control}
          name="meta_data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Data</FormLabel>
              <FormControl>
                <Input placeholder="Enter meta data (JSON)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* Images Field */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="w-fit">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    field.onChange(files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Service"}
        </Button>{" "}
      </form>
    </Form>
  );
};

export default ServicesForm;
