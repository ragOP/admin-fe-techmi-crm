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
import { updateMedicineType } from "../helper/updateMedicineType";
import { createMedicineType } from "../helper/createMedicineType";

const MedicineTypeFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .min(2, "Description is required")
    .max(200, "Description must be under 200 characters"),
  is_active: z.boolean().default(true),
});

const MedicineTypeForm = ({ isEdit = false, initialData }) => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(MedicineTypeFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description || "",
          is_active: initialData.is_active ?? true,
        }
      : {
          name: "",
          description: "",
          is_active: true,
        },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return await updateMedicineType({ id: initialData._id, payload: data });
      } else {
        return await createMedicineType(data);
      }
    },
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(
          `Medicine Type ${isEdit ? "updated" : "created"} successfully`
        );
        navigate("/dashboard/medicine-type");
      } else {
        toast.error(
          res?.response?.data?.message || "Failed to process medicine type"
        );
      }
    },
    onError: () => {
      toast.error(`Failed to ${isEdit ? "update" : "create"} medicine type`);
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter medicine type name" {...field} />
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
              <FormLabel>Description*</FormLabel>
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
            ? "Update Medicine Type"
            : "Create Medicine Type"}
        </Button>
      </form>
    </Form>
  );
};

export default MedicineTypeForm;
