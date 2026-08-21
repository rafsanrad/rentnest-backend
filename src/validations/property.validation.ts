import { z } from "zod";

export const createPropertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  propertyType: z
    .string()
    .trim()
    .min(2, "Property type is required"),

  bedrooms: z
    .number()
    .int()
    .nonnegative("Bedrooms cannot be negative"),

  bathrooms: z
    .number()
    .int()
    .nonnegative("Bathrooms cannot be negative"),

  amenities: z
    .array(z.string())
    .min(1, "At least one amenity is required"),

  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),
});

export const updatePropertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .optional(),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .optional(),

  price: z
    .number()
    .positive("Price must be greater than 0")
    .optional(),

  propertyType: z
    .string()
    .trim()
    .min(2, "Property type is required")
    .optional(),

  bedrooms: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  bathrooms: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  amenities: z
    .array(z.string())
    .optional(),

  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional(),

  status: z
    .enum(["AVAILABLE", "RENTED", "UNAVAILABLE"])
    .optional(),
});