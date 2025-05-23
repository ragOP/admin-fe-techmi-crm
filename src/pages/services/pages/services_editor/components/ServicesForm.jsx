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
import { ServicesFormSchema } from "@/pages/services/pages/services_editor/schema/serviceFormSchema";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";
import { updateService } from "../helper/updateService";
import { createService } from "../helper/createService";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/file/urlToFile";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const ServicesForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reduxAdminId = useSelector(selectAdminId);
  const [images, setImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(ServicesFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      meta_data: initialData?.meta_data || {},
      images: [],
      is_active: initialData?.is_active ?? true,
    },
  });

  // Convert URLs to files when the component mounts
  useEffect(() => {
    const convertUrlsToFiles = async () => {
      if (isEditMode && initialData?.images) {
        const files = await Promise.all(
          initialData.images.map(
            async (url, index) => await urlToFile(url, `file_${index}.jpg`)
          )
        );
        const validFiles = files.filter((file) => file !== null);
        setImages(validFiles); // Set the images state
        form.setValue("images", validFiles); // Update form field value
      }
    };

    convertUrlsToFiles();
  }, [isEditMode, initialData, form]);

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

  // Mutation for updating a service
  const updateMutation = useMutation({
    mutationFn: (data) => updateService({ id, payload: data }),
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
    formData.append("is_active", data.is_active);

    // Append images to form data
    images.forEach((file) => {
      formData.append("images", file);
    });

    if (isEditMode) {
      // Edit mode: Call the update mutation
      updateMutation.mutate(formData);
    } else {
      // Create mode: Call the create mutation
      formData.append("created_by_admin", reduxAdminId);
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
                    setImages((prev) => [...prev, ...files]); // Update images state
                    field.onChange(files); // Update form field value
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file instanceof File ? URL.createObjectURL(file) : file}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedImages = images.filter((_, i) => i !== index);
                  setImages(updatedImages); // Remove the image from the state
                  form.setValue("images", updatedImages); // Update the form field
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row gap-4 items-center">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
