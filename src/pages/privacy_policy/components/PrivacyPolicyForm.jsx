import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { useEffect, useRef, useMemo } from "react";
import TextEditor from "@/components/text_editor";
import { createPrivacyPolicy } from "../helpers/createPrivacyPolicy";
import { updatePrivacyPolicy } from "../helpers/updatePrivacyPolicy";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";

const PrivacyPolicyFormSchema = z.object({
  privacy_policy: z.string().min(2, "Privacy Policy must be at least 2 characters"),
});

const PrivacyPolicyForm = ({ id, isEdit = false, initialData }) => {
  const reduxAdminId = useSelector(selectAdminId);
  const quillRef = useRef();
  const navigate = useNavigate();

  const defaultValues = useMemo(() => ({
    privacy_policy: initialData?.privacy_policy || "",
  }), [initialData]);

  const form = useForm({
    resolver: zodResolver(PrivacyPolicyFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit 
      ? updatePrivacyPolicy({ payload: data, id }) 
      : createPrivacyPolicy({ ...data, created_by_admin: reduxAdminId }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Privacy Policy ${isEdit ? "updated" : "created"} successfully`);
      } else {
        toast.error(res?.response?.message || `Failed to ${isEdit ? "update" : "create"} Privacy Policy`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} Privacy Policy. Please try again.`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (isEdit && initialData) {
      form.setValue("privacy_policy", initialData.privacy_policy);
    }
  }, [isEdit, initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="privacy_policy"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name="privacy_policy"
                  control={form.control}
                  render={({ field }) => (
                    <TextEditor
                      ref={quillRef}
                      defaultValue={field.value}
                      onTextChange={field.onChange}
                      placeholder={"Enter Privacy Policy"}
                      height={600}
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Processing..." : isEdit ? "Update Privacy Policy" : "Create Privacy Policy"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PrivacyPolicyForm;
