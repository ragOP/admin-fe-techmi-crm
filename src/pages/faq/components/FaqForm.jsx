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
import { createFaq } from "../helpers/createFaq";
import { updateFaq } from "../helpers/updateFaq";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";
import { Input } from "@/components/ui/input";

const FaqFormSchema = z.object({
  question: z.string().min(2, "Question must be at least 2 characters"),
  answer: z.string().min(2, "Answer must be at least 2 characters"),
});

const FaqForm = ({ id, isEdit = false, initialData, height, disableMinHeight }) => {
  const reduxAdminId = useSelector(selectAdminId);
  const quillRef = useRef();
  const navigate = useNavigate();

  const defaultValues = useMemo(() => ({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  }), [initialData]);

  const form = useForm({
    resolver: zodResolver(FaqFormSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit 
      ? updateFaq({ payload: data, id }) 
      : createFaq({ ...data, created_by_admin: reduxAdminId }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success(`Faq ${isEdit ? "updated" : "created"} successfully`);
        form.reset();
      } else {
        toast.error(res?.response?.message || `Failed to ${isEdit ? "update" : "create"} Faq`);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} Faq. Please try again.`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (isEdit && initialData) {
      form.setValue("question", initialData.question);
      form.setValue("answer", initialData.answer);
    }
  }, [isEdit, initialData, form]);

  // console.log("isEdit", isEdit);
  // console.log("initialData", initialData);
  // console.log("formValues", form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         {/* Question Field */}
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder="Enter question" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Answer in Quill Editor */}
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name="answer"
                  control={form.control}
                  render={({ field }) => (
                    <TextEditor
                      ref={quillRef}
                      defaultValue={field.value}
                      onTextChange={field.onChange}
                      placeholder={"Enter Answer"}
                      height={height || 600} 
                      disableMinHeight
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
            {mutation.isPending ? "Processing..." : isEdit ? "Update Faq" : "Create Faq"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FaqForm;
