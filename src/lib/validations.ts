import { z } from "zod";

export const discoveryStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const discoverySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(120, "Title cannot exceed 120 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers and hyphens"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(300, "Short description cannot exceed 300 characters"),
  fullDescription: z
    .string()
    .min(30, "Full description must be at least 30 characters"),
  whyInteresting: z
    .string()
    .min(15, "Why interesting section must be at least 15 characters"),
  whatToExplore: z
    .string()
    .min(15, "What to explore section must be at least 15 characters"),
  websiteUrl: z
    .string()
    .url("Must be a valid website URL (starting with http:// or https://)"),
  imageUrl: z
    .string()
    .url("Must be a valid preview image URL (starting with http:// or https://)"),
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  tags: z
    .array(z.string().min(1))
    .or(z.string().transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean)))
    .default([]),
  isFeatured: z.boolean().default(false),
  status: discoveryStatusSchema.default("DRAFT"),
});

export type DiscoveryInput = z.infer<typeof discoverySchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Category name cannot exceed 80 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers and hyphens"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  imageUrl: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Helper to slugify strings cleanly
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Format sequential archive number
 * e.g. index 1 -> FILE 0001
 */
export function formatArchiveNumber(index: number): string {
  const padded = String(index).padStart(4, "0");
  return `FILE ${padded}`;
}
