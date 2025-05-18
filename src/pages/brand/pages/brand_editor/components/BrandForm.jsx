import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { updateBrand } from "../helper/updateBrand";
import { createBrand } from "../helper/createBrand";

const BrandFormSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z
    .string()
    .max(200, "Description must be under 200 characters")
    .optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

const BrandForm = ({ isEdit = false, initialData }) => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          website: initialData.website || "",
          description: initialData.description || "",
          is_active: initialData.is_active ?? true,
        }
      : {
          name: "",
          description: "",
          website: "",
          is_active: true,
        },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return await updateBrand({ id: initialData._id, payload: data });
      } else {
        return await createBrand(data);
      }
    },
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Brand ${isEdit ? "updated" : "created"} successfully`);
        navigate("/dashboard/brands");
      } else {
        toast.error(res?.response?.data?.message || "Failed to process brand");
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} brand`, error);
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Brand Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter description"
                  {...field}
                  maxLength={200}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active */}
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

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Processing..."
            : isEdit
            ? "Update Brand"
            : "Create Brand"}
        </Button>
      </form>
    </Form>
  );
};

export default BrandForm;
