import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z.string().url(),
  customSlug: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date), {
      message: "Due date must be a valid date format (e.g. YYYY-MM-DD)",
    })
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  password: z.string().optional(),
});

export const shortSlugParamSchema = z.object({
  shortSlug: z.string().min(1),
});
