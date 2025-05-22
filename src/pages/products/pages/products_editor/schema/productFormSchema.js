import { z } from "zod";

export const productsFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  small_description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  discounted_price: z
    .number()
    .min(0, "Discounted price must be a positive number")
    .optional(),
  dnd_discounted_price: z
    .number()
    .min(0, "DND Discounted price must be a positive number")
    .optional(),
  salesperson_discounted_price: z
    .number()
    .min(0, "Salesperson Discounted price must be a positive number")
    .optional(),
  instock: z.boolean(),
  manufacturer: z.string().optional(),
  consumed_type: z.string().optional(),
  expiry_date: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  banner_image: z.instanceof(File),
  uploaded_by_brand: z.string().nullable().optional(),
  is_best_seller: z.boolean().optional(),
  category: z.array(z.string()).optional(),
  medicine_type: z.string().nullable().optional(),
  gst: z.number().optional(),
  cgst: z.number().optional(),
  sgst: z.number().optional(),
  igst: z.number().optional(),
  is_active: z.boolean().default(true),
  quantity: z.number().optional(),
});
