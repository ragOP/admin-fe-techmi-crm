import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBlog } from "../helpers/createBlog";
import { useEffect, useRef } from "react";
import TextEditor from "@/components/text_editor";
import { urlToFile } from "@/utils/file/urlToFile";
import { X } from "lucide-react";
import { fetchServices } from "@/pages/services/helpers/fetchServices";
import { updateBlog } from "../helpers/updateBlog";
import { Checkbox } from "@/components/ui/checkbox";

const BlogFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  short_description: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  bannerImageUrl: z.instanceof(File),
  service: z.string().min(1, "Service is required"),
  published: z.boolean(),
  isFeatured: z.boolean(),
});

const BlogForm = ({ isEdit = false, initialData }) => {
  const { id } = useParams();

  const quillRef = useRef();
  const navigate = useNavigate();

  const { data: serviceRes } = useQuery({
    queryKey: ["service"],
    queryFn: fetchServices,
  });
  console.log(serviceRes);
  const services =
    serviceRes && serviceRes.length > 0
      ? serviceRes.map((service) => ({
          value: service._id,
          label: service.name,
        }))
      : [];

  const form = useForm({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      short_description: "",
      bannerImageUrl: null,
      service: "",
      published: false,
      isFeatured: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Blog ${isEdit ? "updated" : "created"} successfully`);
        navigate("/dashboard/blogs");
      } else {
        toast.error(res?.response?.message || "Failed to create blog");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} blog`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateBlog({ payload: data, id }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Blog updated successfully.");
        navigate("/dashboard/blogs");
      } else {
        toast.error("Failed to update blog. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update blog. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    console.log(formData, data);
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  useEffect(() => {
    const convertUrlsToFiles = async () => {
      if (isEdit && initialData?.bannerImageUrl) {
        const bannerFile = await urlToFile(
          initialData.bannerImageUrl,
          "banner.jpg"
        );
        if (bannerFile) {
          form.setValue("bannerImageUrl", bannerFile);
        }
      }
    };

    convertUrlsToFiles();
  }, [isEdit, initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Banner Image URL Field */}

        <FormField
          control={form.control}
          name="bannerImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <div className="w-[20rem]">
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                  />
                  {/* Display selected banner image */}
                  {field.value && (
                    <div className="mt-4 relative">
                      <img
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                        alt="Banner Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange("")}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center gap-12">
          {/* Service Field */}
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services?.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <FormLabel>Published</FormLabel>
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

          {/* Featured Field */}
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-col  gap-4">
                <FormLabel>Featured</FormLabel>
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
        </div>

        {/* Short Description Field */}
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Field using Quill Editor */}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <TextEditor
                      ref={quillRef}
                      defaultValue={field.value}
                      onTextChange={field.onChange}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending
              ? "Processing..."
              : isEdit
              ? "Update Blog"
              : "Create Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
