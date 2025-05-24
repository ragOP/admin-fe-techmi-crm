import { z } from "zod";

export const TestimonialsFormSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  rating: z.number().min(1, "Rating is required"),
  image: z.instanceof(File).optional(),
});
