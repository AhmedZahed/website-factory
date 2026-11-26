import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  application: z.literal("Website Factory"),
  environment: z.enum(["development", "production"]),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
