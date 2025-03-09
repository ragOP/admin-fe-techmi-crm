import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .max(255, "Name must be less than 255 characters")
    .nonempty("Name is required"),
  description: z
    .string()
    .max(2056, "Description must be less than 2056 characters"),
  discount_label_text: z
    .string()
    .max(255, "Discount label must be less than 255 characters")
    .optional(),
  meta_data: z.record(z.any()).optional(),
  newly_launched: z.boolean().default(false),
  is_active: z.boolean().default(true),
  images: z.array(z.instanceof(File)),
  service: z.string().nonempty("Service is required"),
});
