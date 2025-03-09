import { z } from "zod";

export const ServicesFormSchema = z.object({
  name: z
    .string()
    .max(255, "Name must be less than 255 characters")
    .nonempty("Name is required"),
  slug: z
    .string()
    .max(255, "Slug must be less than 255 characters")
    .nonempty("Slug is required"),
  description: z.string().optional(),
  meta_data: z.record(z.any()).optional(),
  images: z.array(z.instanceof(File)),
});
