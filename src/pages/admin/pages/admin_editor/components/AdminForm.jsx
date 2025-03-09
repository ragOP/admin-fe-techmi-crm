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
import { createAdmin } from "../helper/createService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation Schema
const AdminFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
  services: z.array(z.string()).min(1, "At least one service is required"), // Ensure at least one service is selected
});

const AdminForm = ({ isEdit = false, initialData }) => {
  const navigate = useNavigate();

  // Fetch services for dropdown
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const form = useForm({
    resolver: zodResolver(AdminFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      password: "",
      role: "admin",
      services: [], // Initialize as empty array
    },
  });

  const mutation = useMutation({
    mutationFn: createAdmin,
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
    mutation.mutate(data);
  };

  // Handle service selection
  const handleServiceChange = (serviceId, checked) => {
    const currentServices = form.getValues("services") || [];
    const updatedServices = checked
      ? [...currentServices, serviceId] // Add service
      : currentServices.filter((id) => id !== serviceId); // Remove service

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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
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
