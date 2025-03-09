import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";
import { createCategory } from "../helper/createCategory";
import { updateCategory } from "../helper/updateCategory";
import { fetchServices } from "@/pages/services/helpers/fetchServices";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/file/urlToFile";
import { toast } from "sonner";
import { categoryFormSchema } from "../schema/categoryFormSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

const CategoryForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reduxAdminId = useSelector(selectAdminId);
  const [images, setImages] = useState([]);

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      discount_label_text: initialData?.discount_label_text || "",
      newly_launched: initialData?.newly_launched || false,
      is_active: initialData?.is_active || true,
      images: [],
      service: initialData?.service,
    },
  });

  useEffect(() => {
    const convertUrlsToFiles = async () => {
      if (isEditMode && initialData?.images) {
        const files = await Promise.all(
          initialData.images.map(
            async (url, index) => await urlToFile(url, `file_${index}.jpg`)
          )
        );
        setImages(files.filter(Boolean));
        form.setValue("images", files);
      }
    };
    convertUrlsToFiles();
  }, [isEditMode, initialData, form]);

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Category created successfully.");
        form.reset();
        navigate("/dashboard/categories");
      } else {
        toast.error("Failed to create category.");
      }
    },
    onError: () => toast.error("Failed to create category."),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateCategory({ id, payload: data }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Category updated successfully.");
        navigate("/dashboard/categories");
      } else {
        toast.error("Failed to update category.");
      }
    },
    onError: () => toast.error("Failed to update category."),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("discount_label_text", data.discount_label_text || "");
    formData.append("newly_launched", data.newly_launched);
    formData.append("is_active", data.is_active);
    formData.append("created_by_admin", reduxAdminId);
    formData.append("service[]", data.service);
    images.forEach((file) => formData.append("images", file));

    isEditMode
      ? updateMutation.mutate(formData)
      : createMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_label_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Label Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter discount label text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newly_launched"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel>Newly Launched</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel>Is Active</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Services</FormLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="space-y-3 mt-2"
              >
                {services?.map((service) => (
                  <FormItem
                    key={service._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={service._id}
                      id={`service-${service._id}`}
                    />
                    <label
                      htmlFor={`service-${service._id}`}
                      className="text-sm font-medium leading-none"
                    >
                      {service.name}
                    </label>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditMode
            ? updateMutation.isPending
              ? "Updating..."
              : "Update Category"
            : createMutation.isPending
            ? "Creating..."
            : "Create Category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
