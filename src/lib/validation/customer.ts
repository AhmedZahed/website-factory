import { z } from "zod";

const customerStatusSchema = z.enum(["active", "inactive"]);
const customerPhoneSchema = z.string().trim().min(3).max(32).nullable();
const customerEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254)
  .nullable();

export const createCustomerSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: customerPhoneSchema.optional().default(null),
    email: customerEmailSchema.optional().default(null),
    business_name: z.string().trim().min(1).max(160),
    status: customerStatusSchema.optional().default("active"),
  })
  .strict();

export const updateCustomerSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: customerPhoneSchema.optional(),
    email: customerEmailSchema.optional(),
    business_name: z.string().trim().min(1).max(160).optional(),
    status: customerStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one customer field is required",
  });

export const customerIdSchema = z.string().trim().min(1).max(256);

export const listCustomersQuerySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    status: customerStatusSchema.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
  })
  .strict();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
