import type { TemplateDefinition } from "./types.ts";

export const TEMPLATE_REGISTRY = [
  {
    id: "builtin-services-maintenance",
    slug: "services-maintenance",
    category: "services-maintenance",
    name: { ar: "الخدمات والصيانة", en: "Services & Maintenance" },
    description: {
      ar: "قالب لفرق الخدمات والصيانة التي تحتاج إلى عرض واضح لما تقدمه.",
      en: "A focused starting point for service and maintenance teams.",
    },
    supportedSections: [
      "hero",
      "services",
      "benefits",
      "process",
      "locations",
      "testimonials",
      "faq",
      "contact",
    ],
  },
  {
    id: "builtin-contracting-real-estate",
    slug: "contracting-real-estate",
    category: "contracting-real-estate",
    name: { ar: "المقاولات والعقارات", en: "Contracting & Real Estate" },
    description: {
      ar: "قالب لعرض المشاريع والخدمات والعقارات بطريقة عملية.",
      en: "A project-led template for contractors and property businesses.",
    },
    supportedSections: [
      "hero",
      "projects",
      "services",
      "process",
      "gallery",
      "testimonials",
      "faq",
      "contact",
    ],
  },
  {
    id: "builtin-corporate-professional",
    slug: "corporate-professional",
    category: "corporate-professional",
    name: { ar: "الشركات والخدمات المهنية", en: "Corporate & Professional" },
    description: {
      ar: "قالب مرن للشركات ومقدمي الخدمات المهنية.",
      en: "A flexible foundation for companies and professional services.",
    },
    supportedSections: [
      "hero",
      "services",
      "benefits",
      "team",
      "case-studies",
      "testimonials",
      "faq",
      "contact",
    ],
  },
  {
    id: "builtin-restaurants-cafes-juice",
    slug: "restaurants-cafes-juice",
    category: "restaurants-cafes-juice",
    name: { ar: "المطاعم والمقاهي والعصائر", en: "Restaurants, Cafes & Juice" },
    description: {
      ar: "قالب يبرز قائمة الطعام وأجواء المكان ومعلومات الزيارة.",
      en: "A menu-focused template for restaurants, cafes, and juice shops.",
    },
    supportedSections: [
      "hero",
      "menu",
      "story",
      "gallery",
      "opening-hours",
      "locations",
      "contact",
    ],
  },
  {
    id: "builtin-shops-personal-services",
    slug: "shops-personal-services",
    category: "shops-personal-services",
    name: { ar: "المتاجر والخدمات الشخصية", en: "Shops & Personal Services" },
    description: {
      ar: "قالب لمتاجر الحي ومقدمي الخدمات الشخصية.",
      en: "A flexible storefront foundation for local shops and personal services.",
    },
    supportedSections: [
      "hero",
      "catalog",
      "featured-services",
      "team",
      "gallery",
      "testimonials",
      "faq",
      "contact",
    ],
  },
  {
    id: "builtin-law-firms-legal",
    slug: "law-firms-legal",
    category: "law-firms-legal",
    name: { ar: "مكاتب المحاماة والخدمات القانونية", en: "Law Firms & Legal Services" },
    description: {
      ar: "قالب مهني لمكاتب المحاماة والخدمات القانونية.",
      en: "A professional foundation for law firms and legal service providers.",
    },
    supportedSections: [
      "hero",
      "lawyer-intro",
      "practice-areas",
      "qualifications",
      "consultation",
      "articles",
      "faq",
      "accreditation",
      "contact",
    ],
  },
] as const satisfies readonly TemplateDefinition[];

export type TemplateId = (typeof TEMPLATE_REGISTRY)[number]["id"];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.id === id);
}

export function getTemplateBySlug(
  slug: string,
): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.slug === slug);
}
