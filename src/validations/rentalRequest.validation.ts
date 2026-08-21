import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z
    .string()
    .uuid("Invalid property ID"),

  moveInDate: z
    .string()
    .datetime("Invalid move-in date"),

  message: z
    .string()
    .trim()
    .max(500, "Message must not exceed 500 characters")
    .optional(),
});

export const updateRentalRequestStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});