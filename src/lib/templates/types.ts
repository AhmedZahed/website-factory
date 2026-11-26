export const TEMPLATE_SECTION_TYPES = [
  "hero",
  "services",
  "projects",
  "process",
  "benefits",
  "team",
  "case-studies",
  "testimonials",
  "contact",
  "faq",
  "menu",
  "story",
  "gallery",
  "opening-hours",
  "locations",
  "featured-services",
  "catalog",
  "lawyer-intro",
  "practice-areas",
  "qualifications",
  "consultation",
  "articles",
  "accreditation",
] as const;

export type TemplateSectionType = (typeof TEMPLATE_SECTION_TYPES)[number];
export type TemplateLanguage = "ar" | "en";
export type TemplateCategory =
  | "services-maintenance"
  | "contracting-real-estate"
  | "corporate-professional"
  | "restaurants-cafes-juice"
  | "shops-personal-services"
  | "law-firms-legal";

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  category: TemplateCategory;
  name: LocalizedText;
  description: LocalizedText;
  supportedSections: readonly TemplateSectionType[];
}

export type TemplateFontPreset =
  | "system"
  | "arabic-sans"
  | "editorial-serif"
  | "modern-sans";

export interface TemplateCustomization {
  schemaVersion: 1;
  business: {
    name: LocalizedText;
    tagline?: LocalizedText;
    description?: LocalizedText;
    phone?: string;
    whatsapp?: string;
    appointmentUrl?: string;
    email?: string;
    address?: LocalizedText;
  };
  brand: {
    logo?: {
      src: string;
      alt: LocalizedText;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    typography: {
      heading: TemplateFontPreset;
      body: TemplateFontPreset;
    };
  };
  images: {
    hero?: {
      src: string;
      alt: LocalizedText;
    };
    gallery: Array<{
      src: string;
      alt: LocalizedText;
    }>;
  };
  sections: Array<{
    id: string;
    type: TemplateSectionType;
    order: number;
    visible: boolean;
    content: Record<string, unknown>;
  }>;
}

export interface TemplatePreviewProps {
  template: TemplateDefinition;
  language: TemplateLanguage;
  customization: TemplateCustomization;
}
