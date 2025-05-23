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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import TextEditor from "@/components/text_editor";
import { createTermsCondition } from "../helpers/createTermsCondition";
import { updateTermsConditions } from "../helpers/updateTermsCondition";

const TermsConditionFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters")
});

const TermsConditionForm = ({ isEdit = false, initialData }) => {
  const { id } = useParams();

  const quillRef = useRef();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(TermsConditionFormSchema),
    defaultValues: initialData || {
      title: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createTermsCondition,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Terms Condition ${isEdit ? "updated" : "created"} successfully`);
      } else {
        toast.error(res?.response?.message || "Failed to create Terms Condition");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} Terms Condition`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTermsConditions({ payload: data, id }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Terms Condition updated successfully.");
      } else {
        toast.error("Failed to update Terms Condition. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update Terms Condition. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        {/* <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter Terms & Conditions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Title Field using Quill Editor */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Controller
                  name="title"
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
              ? "Update Terms Condition"
              : "Create Terms Condition"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TermsConditionForm;
