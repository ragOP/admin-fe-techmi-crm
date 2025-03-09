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
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/admin/adminSelector";
import { updateService } from "../helper/updateService";
import { createService } from "../helper/createService";

const ServicesForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reduxAdmin = useSelector(selectAdmin);

  console.log("Initial Data >>>>>", initialData);
  const form = useForm({
    resolver: zodResolver(ServicesFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      meta_data: initialData?.meta_data || {},
      images: initialData?.images || [],
    },
  });

  // const { watch, formState } = form;
  // const allFields = watch();

  // useEffect(() => {
  //   console.log("Form Fields Updated >>>>>", allFields);
  // }, [allFields]);

  // Mutation for creating a service
  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Service created successfully.");
        form.reset();
        navigate("/dashboard/services");
      } else {
        toast.error("Failed to create service. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create service. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateService(id, data),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Service updated successfully.");
        navigate("/dashboard/services");
      } else {
        toast.error("Failed to update service. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update service. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("created_by_admin", reduxAdmin);

    data.images.forEach((file) => {
      formData.append("images", file);
    });

    if (isEditMode) {
      // Edit mode: Call the update mutation
      updateMutation.mutate(formData);
    } else {
      // Create mode: Call the create mutation
      createMutation.mutate(formData);
    }
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
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Service"
            : "Create Service"}
        </Button>
      </form>
    </Form>
  );
};

export default ServicesForm;
