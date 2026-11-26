import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type {
  TemplateCustomization,
  TemplateDefinition,
  TemplateLanguage,
  TemplatePreviewProps,
  TemplateSectionType,
} from "../../lib/templates/types";

export type PreviewSection = TemplateCustomization["sections"][number];
export type PreviewProps = TemplatePreviewProps & { sections: PreviewSection[]; styles: CSSProperties };
export type PreviewItem = { title: string; description: string; meta?: string };
export type SectionRenderer = (section: PreviewSection, order: number) => ReactNode;

const labels: Record<TemplateSectionType, { ar: string; en: string }> = {
  hero: { ar: "الرئيسية", en: "Home" },
  services: { ar: "الخدمات", en: "Services" },
  projects: { ar: "المشاريع", en: "Projects" },
  process: { ar: "طريقة العمل", en: "Process" },
  benefits: { ar: "لماذا نحن", en: "Why us" },
  team: { ar: "الفريق", en: "Team" },
  "case-studies": { ar: "دراسات الحالة", en: "Case studies" },
  testimonials: { ar: "آراء العملاء", en: "Reviews" },
  contact: { ar: "التواصل", en: "Contact" },
  faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
  menu: { ar: "القائمة", en: "Menu" },
  story: { ar: "قصتنا", en: "Our story" },
  gallery: { ar: "معرض الصور", en: "Gallery" },
  "opening-hours": { ar: "أوقات العمل", en: "Hours" },
  locations: { ar: "الفروع", en: "Locations" },
  "featured-services": { ar: "خدمات مختارة", en: "Featured services" },
  catalog: { ar: "المتجر", en: "Shop" },
  "lawyer-intro": { ar: "عن المكتب", en: "The firm" },
  "practice-areas": { ar: "مجالات الممارسة", en: "Practice areas" },
  qualifications: { ar: "المؤهلات", en: "Qualifications" },
  consultation: { ar: "الاستشارة", en: "Consultation" },
  articles: { ar: "المقالات", en: "Articles" },
  accreditation: { ar: "الاعتماد", en: "Accreditation" },
};

export function text(value: unknown, language: TemplateLanguage, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    const selected = candidate[language] ?? candidate.en ?? candidate.ar;
    if (typeof selected === "string" && selected.trim()) return selected.trim();
  }
  return fallback;
}

export function sectionTitle(section: PreviewSection, language: TemplateLanguage, fallback?: string) {
  return text(section.content.heading ?? section.content.title, language, fallback ?? labels[section.type][language]);
}

export function sectionIntro(section: PreviewSection, language: TemplateLanguage) {
  return text(section.content.intro ?? section.content.description, language);
}

export function itemsFor(section: PreviewSection, language: TemplateLanguage): PreviewItem[] {
  const source = section.content.items ?? section.content.entries ?? section.content.cards;
  if (!Array.isArray(source)) return [];
  return source.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const title = text(item.title, language);
    const description = text(item.description, language);
    if (!title && !description) return [];
    return [{ title: title || (language === "ar" ? "تفاصيل إضافية" : "More details"), description, meta: text(item.meta, language) || undefined }];
  });
}

export function sectionAnchor(type: TemplateSectionType) {
  return type === "contact" ? "tp-contact" : `tp-section-${type}`;
}

export function sectionTarget(sections: PreviewSection[], preferred: TemplateSectionType) {
  const target = sections.find((section) => section.type === preferred)
    ?? sections.find((section) => section.type === "contact");
  return target ? `#${sectionAnchor(target.type)}` : "#tp-top";
}

export function SectionNav({ sections, language }: { sections: PreviewSection[]; language: TemplateLanguage }) {
  return <nav className="tp-layout-nav" aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
    {sections.filter((section) => section.type !== "hero").slice(0, 5).map((section) =>
      <a key={section.id} href={`#${sectionAnchor(section.type)}`}>{labels[section.type][language]}</a>)}
  </nav>;
}

export function Brand({ customization, template, language, compact = false }: {
  customization: TemplateCustomization; template: TemplateDefinition; language: TemplateLanguage; compact?: boolean;
}) {
  const fallback = language === "ar" ? "اسم النشاط التجاري" : "Business name";
  const name = text(customization.business.name, language, fallback);
  const icon = template.category === "law-firms-legal" ? <Scale />
    : template.category === "restaurants-cafes-juice" ? <UtensilsCrossed />
      : template.category === "contracting-real-estate" ? <Building2 />
        : template.category === "services-maintenance" ? <Wrench />
          : template.category === "shops-personal-services" ? <BadgeCheck /> : <ShieldCheck />;
  return <a className={`tp-layout-brand${compact ? " is-compact" : ""}`} href="#tp-top" aria-label={name}>
    {customization.brand.logo
      ? <img src={customization.brand.logo.src} alt={text(customization.brand.logo.alt, language, name)} />
      : <span className="tp-layout-brand-mark" aria-hidden="true">{icon}</span>}
    <span>{name}</span>
  </a>;
}

export function ContactActions({ customization, language, variant = "" }: {
  customization: TemplateCustomization; language: TemplateLanguage; variant?: string;
}) {
  const { phone, whatsapp, appointmentUrl, email, address } = customization.business;
  const ar = language === "ar";
  const digits = (value: string) => value.replace(/[^\d+]/g, "");
  const actions = [
    phone ? <a key="phone" data-testid="link-preview-phone" href={`tel:${digits(phone)}`}><Phone />{phone}</a> : null,
    whatsapp ? <a key="whatsapp" data-testid="link-preview-whatsapp" href={`https://wa.me/${digits(whatsapp).replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"><MessageCircle />{ar ? "واتساب" : "WhatsApp"}</a> : null,
    appointmentUrl && safeHttps(appointmentUrl) ? <a key="appointment" data-testid="link-preview-appointment" href={safeHttps(appointmentUrl)} target="_blank" rel="noopener noreferrer"><CalendarDays />{ar ? "حجز موعد" : "Appointment details"}</a> : null,
    email ? <a key="email" data-testid="link-preview-email" href={`mailto:${email}`}>{email}</a> : null,
    address ? <span key="address"><MapPin />{text(address, language, ar ? "العنوان" : "Address")}</span> : null,
  ].filter(Boolean);
  return <div className={`tp-layout-contact-actions ${variant}`}>
    {actions.length ? actions : <p className="tp-owner-prompt">{ar ? "أضف وسيلة التواصل المعتمدة ليتواصل معك الزوار." : "Add a confirmed contact method so visitors can reach you."}</p>}
  </div>;
}

function safeHttps(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function PreviewFooter({ customization, template, language }: Pick<PreviewProps, "customization" | "template" | "language">) {
  const ar = language === "ar";
  return <footer className="tp-layout-footer">
    <Brand customization={customization} template={template} language={language} compact />
    <span>{ar ? "معاينة قابلة للتخصيص — أضف بياناتك المعتمدة قبل النشر." : "Editable preview — add confirmed business details before publishing."}</span>
    <a href="#tp-top">{ar ? "للأعلى" : "Back to top"} {ar ? <ArrowDownRight /> : <ArrowDownLeft />}</a>
  </footer>;
}

export function SectionHeading({ section, language, kicker }: {
  section: PreviewSection; language: TemplateLanguage; kicker?: string;
}) {
  const intro = sectionIntro(section, language);
  return <header className="tp-layout-section-head">
    {kicker && <span className="tp-layout-kicker">{kicker}</span>}
    <h2>{sectionTitle(section, language)}</h2>
    {intro && <p>{intro}</p>}
  </header>;
}

export function OwnerPrompt({ children, kind = "detail" }: { children: ReactNode; kind?: string }) {
  return <div className="tp-owner-prompt" data-testid={`owner-prompt-${kind}`}>
    <span className="tp-owner-prompt-mark" aria-hidden="true">+</span>
    <p>{children}</p>
  </div>;
}

export function DemoImage({ customization, language, variant = "graphic", index = 0 }: {
  customization: TemplateCustomization; language: TemplateLanguage; variant?: string; index?: number;
}) {
  const image = index === 0 ? customization.images.hero : customization.images.gallery[index - 1];
  if (image) return <div className={`tp-image-frame tp-image-${variant}`}>
    <img src={image.src} alt={text(image.alt, language, "")} loading="lazy" />
  </div>;
  const glyphs: Record<string, string> = {
    architecture: "01", food: "∿", service: "↗", editorial: "§", retail: "✦", corporate: "◎",
  };
  return <div className={`tp-image-frame tp-image-${variant} tp-image-placeholder`} role="img" aria-label={language === "ar" ? "مساحة صورة قابلة للتخصيص" : "Customizable image space"}>
    <span className="tp-placeholder-grid" aria-hidden="true" />
    <span className="tp-placeholder-glyph" aria-hidden="true">{glyphs[variant] ?? "＋"}</span>
    <span className="tp-image-caption">{language === "ar" ? "أضف صورتك الأصلية" : "Add your own image"}</span>
  </div>;
}

export function DataNote({ language, children }: { language: TemplateLanguage; children?: ReactNode }) {
  return <p className="tp-data-note"><ShieldCheck aria-hidden="true" />{children ?? (language === "ar"
    ? "أضف هنا معلومات موثقة ومعتمدة من نشاطك."
    : "Add verified, owner-approved information here.")}</p>;
}

export function ContactSection({ section, language, customization, layout }: {
  section: PreviewSection; language: TemplateLanguage; customization: TemplateCustomization; layout: string;
}) {
  return <section id="tp-contact" className={`tp-contact-panel tp-contact-${layout}`} data-testid="section-preview-contact">
    <div><SectionHeading section={section} language={language} kicker={language === "ar" ? "تواصل" : "LET'S TALK"} /></div>
    <ContactActions customization={customization} language={language} />
  </section>;
}

export function HeroCopy({ section, language, customization, ctaHref = "#tp-contact", ctaLabel }: {
  section: PreviewSection; language: TemplateLanguage; customization: TemplateCustomization; ctaHref?: string; ctaLabel?: string;
}) {
  const ar = language === "ar";
  const title = text(section.content.title, language, text(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name"));
  const tagline = text(section.content.tagline ?? customization.business.tagline, language, ar ? "أضف عبارة تعريفية معتمدة." : "Add an approved business tagline.");
  const description = text(section.content.description ?? customization.business.description, language, ar ? "أضف نبذة نشاطك المعتمدة هنا." : "Add your approved business introduction here.");
  return <div className="tp-layout-hero-copy">
    <span className="tp-layout-kicker">{ar ? "معاينة قابلة للتخصيص" : "LOCAL BUSINESS / PREVIEW"}</span>
    <h1>{title}<em>{tagline}</em></h1>
    <p>{description}</p>
    <a className="tp-layout-cta" href={ctaHref}>{ctaLabel ?? (ar ? "تواصل معنا" : "Get in touch")}{ar ? <ArrowLeft /> : <ArrowRight />}</a>
  </div>;
}

export function SectionAttrs({ section, index, className = "" }: { section: PreviewSection; index: number; className?: string }) {
  return { id: sectionAnchor(section.type), className: `tp-layout-section tp-section-${section.type} ${className}`, "data-testid": `section-preview-${section.type}-${index}` };
}

export function HoursPlaceholder({ language }: { language: TemplateLanguage }) {
  return <div className="tp-hours-empty"><Clock3 aria-hidden="true" /><span>{language === "ar" ? "أضف أوقات العمل المؤكدة" : "Add confirmed opening hours"}</span></div>;
}

export function ProofPlaceholder({ language, label }: { language: TemplateLanguage; label: string }) {
  return <OwnerPrompt kind="proof">{language === "ar" ? `أضف ${label} الموثقة هنا قبل النشر.` : `Add verified ${label} here before publishing.`}</OwnerPrompt>;
}

export function sectionLabel(type: TemplateSectionType, language: TemplateLanguage) {
  return labels[type][language];
}

