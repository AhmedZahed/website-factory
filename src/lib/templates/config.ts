import { z } from "zod";
import { TEMPLATE_SECTION_TYPES } from "./types";

const imageSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Use a local asset path or an HTTPS image URL");

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const fontPresetSchema = z.enum([
  "system",
  "arabic-sans",
  "editorial-serif",
  "modern-sans",
]);
const sectionTypeSchema = z.enum(TEMPLATE_SECTION_TYPES);
const localizedTextSchema = z
  .object({
    ar: z.string().trim().min(1).max(1600),
    en: z.string().trim().min(1).max(1600),
  })
  .strict();

export const templateCustomizationSchema = z
  .object({
    schemaVersion: z.literal(1),
    business: z
      .object({
        name: localizedTextSchema,
        tagline: localizedTextSchema.optional(),
        description: localizedTextSchema.optional(),
        phone: z.string().trim().max(32).optional(),
        whatsapp: z.string().trim().max(32).optional(),
        appointmentUrl: z.url().refine((value) => new URL(value).protocol === "https:").optional(),
        email: z.email().max(254).optional(),
        address: localizedTextSchema.optional(),
      })
      .strict(),
    brand: z
      .object({
        logo: z
          .object({
            src: imageSourceSchema,
            alt: localizedTextSchema,
          })
          .strict()
          .optional(),
        colors: z
          .object({
            primary: colorSchema,
            secondary: colorSchema,
            accent: colorSchema,
            background: colorSchema,
            text: colorSchema,
          })
          .strict(),
        typography: z
          .object({
            heading: fontPresetSchema,
            body: fontPresetSchema,
          })
          .strict(),
      })
      .strict(),
    images: z
      .object({
        hero: imageSourceSchema.optional(),
        gallery: z.array(imageSourceSchema).max(24),
      })
      .strict(),
    sections: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(120),
            type: sectionTypeSchema,
            order: z.number().int().min(0).max(500),
            visible: z.boolean(),
            content: z.record(z.string(), z.unknown()),
          })
          .strict(),
      )
      .max(80),
  })
  .strict()
  .superRefine((value, context) => {
    const ids = new Set<string>();
    const sectionTypes = new Set<string>();
    for (const [index, section] of value.sections.entries()) {
      if (ids.has(section.id)) {
        context.addIssue({
          code: "custom",
          path: ["sections", index, "id"],
          message: "Section ids must be unique",
        });
      }
      if (sectionTypes.has(section.type)) {
        context.addIssue({
          code: "custom",
          path: ["sections", index, "type"],
          message: "A template can include each section type only once",
        });
      }
      ids.add(section.id);
      sectionTypes.add(section.type);
    }
  });

export type TemplateCustomizationInput = z.infer<
  typeof templateCustomizationSchema
>;
