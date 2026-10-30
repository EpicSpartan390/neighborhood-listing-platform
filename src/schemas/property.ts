import { z } from "zod";

export const propertySchema = z
  .object({
    address: z.string().trim().min(5, "Address must contain at least 5 characters."),
    price: z.number().finite().nonnegative("Price must be non-negative."),
    bedrooms: z.number().int().nonnegative("Bedrooms must be a non-negative integer."),
    bathrooms: z.number().finite().nonnegative("Bathrooms must be non-negative."),
    square_feet: z.number().int().positive("Square feet must be a positive integer."),
  })
  .strict();

export type PropertyInput = z.infer<typeof propertySchema>;
