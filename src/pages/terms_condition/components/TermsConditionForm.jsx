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
import { createTermsCondition } from "../helpers/createTermsCondition";
import { updateTermsConditions } from "../helpers/updateTermsCondition";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";

const TermsConditionFormSchema = z.object({
  terms_and_conditions: z.string().min(2, "Terms and Conditions must be at least 2 characters"),
});

const TermsConditionForm = ({ id, isEdit = false, initialData }) => {
  const reduxAdminId = useSelector(selectAdminId);
  const quillRef = useRef();
  const navigate = useNavigate();

  const defaultValues = useMemo(() => ({
    terms_and_conditions: initialData?.terms_and_conditions || "",
  }), [initialData]);

  const form = useForm({
    resolver: zodResolver(TermsConditionFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit 
      ? updateTermsConditions({ payload: data, id }) 
      : createTermsCondition({ ...data, created_by_admin: reduxAdminId }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Terms Condition ${isEdit ? "updated" : "created"} successfully`);
      } else {
        toast.error(res?.response?.message || `Failed to ${isEdit ? "update" : "create"} Terms Condition`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} Terms Condition. Please try again.`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (isEdit && initialData) {
      form.setValue("terms_and_conditions", initialData.terms_and_conditions);
    }
  }, [isEdit, initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="terms_and_conditions"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name="terms_and_conditions"
                  control={form.control}
                  render={({ field }) => (
                    <TextEditor
                      ref={quillRef}
                      defaultValue={field.value}
                      onTextChange={field.onChange}
                      placeholder={"Enter Terms & Conditions"}
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
            {mutation.isPending ? "Processing..." : isEdit ? "Update Terms Condition" : "Create Terms Condition"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TermsConditionForm;
