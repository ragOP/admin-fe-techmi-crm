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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "@/pages/services/helpers/fetchServices";
import { createAdmin } from "../helper/createAdmin";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAdmin } from "../helper/updateAdmin";

// Validation Schema
const AdminFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["admin"]),
  services: z.array(z.string()).min(1, "At least one service is required"),
  is_active: z.boolean().default(true),
});

const AdminForm = ({ isEdit = false, initialData }) => {
  const navigate = useNavigate();
  console.log("AdminForm", initialData);
  // Fetch services for dropdown
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const form = useForm({
    resolver: zodResolver(AdminFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          password: "",
          is_active: initialData.is_active ?? true,
          services: Array.isArray(initialData.services)
            ? initialData.services.map((s) =>
                typeof s === "string" ? s : s._id
              )
            : [],
        }
      : {
          name: "",
          email: "",
          password: "",
          role: "admin",
          services: [],
          is_active: true,
        },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        const payload = {
          name: form.getValues("name"),
          email: form.getValues("email"),
          role: form.getValues("role"),
          services: form.getValues("services"),
          is_active: form.getValues("is_active"),
        };
        return await updateAdmin({ id: initialData._id, payload });
      } else {
        const payload = {
          name: form.getValues("name"),
          email: form.getValues("email"),
          password: form.getValues("password"),
          role: form.getValues("role"),
          services: form.getValues("services"),
          is_active: form.getValues("is_active"),
        };
        return await createAdmin(payload);
      }
    },
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Admin ${isEdit ? "updated" : "created"} successfully`);
        navigate("/dashboard/admins");
      } else {
        toast.error(res?.response?.message || "Failed to create admin");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} admin`);
    },
  });

  const onSubmit = async (data) => {
    // Remove password if editing and password is empty
    if (isEdit && !data.password) {
      const { password, ...rest } = data;
      mutation.mutate(rest);
    } else {
      mutation.mutate(data);
    }
  };

  // Handle service selection
  const handleServiceChange = (serviceId, checked) => {
    const currentServices = form.getValues("services") || [];
    const updatedServices = checked
      ? [...currentServices, serviceId]
      : currentServices.filter((id) => id !== serviceId);

    form.setValue("services", updatedServices);
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter admin's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter admin email"
                  {...field}
                  disabled={isEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field (only on add) */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services Field (Multi-Select) */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Services</FormLabel>
              <div className="space-y-3 mt-2">
                {services?.map((service) => (
                  <div key={service._id} className="flex items-center gap-2">
                    <Checkbox
                      id={`service-${service._id}`}
                      checked={field.value?.includes(service._id)}
                      onCheckedChange={(checked) =>
                        handleServiceChange(service._id, checked)
                      }
                    />
                    <label
                      htmlFor={`service-${service._id}`}
                      className="text-sm font-medium leading-none"
                    >
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Field */}
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
            ? "Update Admin"
            : "Create Admin"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminForm;
