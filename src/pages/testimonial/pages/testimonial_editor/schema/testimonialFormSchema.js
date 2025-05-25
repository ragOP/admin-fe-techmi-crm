import { z } from "zod";

export const TestimonialsFormSchema = z.object({
  customer_name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  message: z.string().min(1, "Message is required").max(200, "Max 200 characters"),
  rating: z.number().min(1, "Rating is required").max(5, "Max 5"),
  image: z
    .union([z.instanceof(File), z.string().url()])
    .optional(),
});
