import {
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  FileText,
  Hammer,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import type { CSSProperties } from "react";
import type {
  TemplateCustomization,
  TemplateLanguage,
  TemplatePreviewProps,
  TemplateSectionType,
} from "../../lib/templates/types";
import "./template-preview.css";

type Copy = { ar: string; en: string };
type DemoItem = { title: Copy; description: Copy; meta?: Copy };

const copy = (ar: string, en: string): Copy => ({ ar, en });
const demoLabel = copy("نص تجريبي للمعاينة", "Demo copy for preview");

const demoContent: Record<string, DemoItem[]> = {
  services: [
    { title: copy("خدمة دقيقة", "Thoughtful service"), description: copy("نبدأ بفهم احتياجك، ثم نرتب الخطوات بوضوح.", "We begin by understanding what you need, then make every next step clear.") },
    { title: copy("تنفيذ موثوق", "Reliable delivery"), description: copy("فريق جاهز للعمل باهتمام بالتفاصيل من البداية للنهاية.", "A capable team, attentive to the details from first visit to final handover.") },
    { title: copy("متابعة مستمرة", "Care that continues"), description: copy("نبقى قريبين بعد الإنجاز للإجابة عن أسئلتك.", "We stay close after delivery, ready to answer your questions.") },
  ],
  process: [
    { title: copy("نستمع", "We listen"), description: copy("نحدد الأولويات ونفهم الصورة كاملة.", "We clarify priorities and understand the full picture.") },
    { title: copy("نخطط", "We plan"), description: copy("نشاركك نطاق العمل والخطوات المتوقعة.", "We agree on the scope and the steps ahead.") },
    { title: copy("ننجز", "We deliver"), description: copy("تنفيذ منظم مع تحديثات واضحة.", "Organized work, with clear progress updates.") },
  ],
  benefits: [
    { title: copy("وضوح من البداية", "Clarity from day one"), description: copy("تواصل مباشر وتوقعات محددة.", "Direct communication and well-defined expectations.") },
    { title: copy("اهتمام بالتفاصيل", "Care in the details"), description: copy("جودة ثابتة في كل مرحلة.", "Consistent quality at every stage.") },
    { title: copy("حلول مناسبة", "Solutions that fit"), description: copy("خيارات عملية تراعي احتياجك.", "Practical options shaped around your needs.") },
  ],
  testimonials: [
    { title: copy("تجربة واضحة ومريحة", "A clear, reassuring experience"), description: copy("«كان التواصل منظماً، وعرفنا ما الذي سيحدث في كل خطوة.»", "“Communication was organized, and we knew what to expect at every step.”"), meta: copy("نموذج توضيحي — ليس اقتباساً من عميل حقيقي", "Illustrative example — not a real customer quote") },
  ],
  faq: [
    { title: copy("كيف أبدأ؟", "How do I get started?"), description: copy("تواصل معنا لمشاركة احتياجك، وسنوضح لك الخطوات المناسبة.", "Get in touch to share what you need and we’ll outline the right next steps.") },
    { title: copy("هل يمكن تخصيص الخدمة؟", "Can the service be tailored?"), description: copy("تُحدد الخيارات بعد معرفة نطاق العمل واحتياجاتك.", "Options can be discussed once we understand the scope and your needs.") },
  ],
  projects: [
    { title: copy("مساحة عمل معاصرة", "A contemporary workspace"), description: copy("نموذج عرض لمشروع تجريبي؛ أضف تفاصيل مشاريعك المعتمدة هنا.", "A sample project card. Replace with details of your verified work.") },
    { title: copy("تجديد منزل عائلي", "A family home renovation"), description: copy("نموذج عرض لمشروع تجريبي؛ الصور والتفاصيل قابلة للاستبدال.", "A sample project card. Photos and details are ready to be replaced.") },
    { title: copy("وجهة تجارية محلية", "A neighborhood destination"), description: copy("نموذج تجريبي يعرض طريقة تقديم المشروع.", "An illustrative example of how a project can be presented.") },
  ],
  gallery: [
    { title: copy("مشهد من المكان", "A sense of place"), description: copy("مساحة مخصصة لصورة من اختيارك.", "A space for an image you choose.") },
    { title: copy("تفاصيل العمل", "Details at work"), description: copy("أضف صوراً أصلية تعكس عملك.", "Add original photos that reflect your work.") },
    { title: copy("لحظات يومية", "Everyday moments"), description: copy("صور تجريبية — استبدلها بمحتواك.", "Demo image treatment — replace with your own content.") },
  ],
  team: [
    { title: copy("فريق قريب منك", "People close to the work"), description: copy("أضف أسماء الفريق ومعلوماتهم بعد اعتمادها.", "Add team names and details once confirmed.") },
    { title: copy("خبرات متنوعة", "A range of perspectives"), description: copy("تعريف تجريبي — لا يمثل أفراداً حقيقيين.", "Sample introduction — no real individuals represented.") },
  ],
  "case-studies": [
    { title: copy("من التحدي إلى الحل", "From challenge to solution"), description: copy("نموذج دراسة حالة. أضف نتائج موثقة بموافقة أصحابها.", "A case study layout. Add verified results with permission.") },
    { title: copy("عمل يترك أثراً", "Work with a lasting impact"), description: copy("مساحة لسرد السياق والنهج والنتائج الفعلية.", "Space to share context, approach, and real outcomes.") },
  ],
  menu: [
    { title: copy("قهوة اليوم", "Coffee, your way"), description: copy("إسبريسو، قهوة مقطرة، ومشروبات موسمية.", "Espresso, slow brews, and seasonal drinks."), meta: copy("ابتداءً من ١٨ ر.س", "From SAR 18") },
    { title: copy("مخبوزات طازجة", "Fresh from the oven"), description: copy("اختيارات يومية تُحضّر بعناية.", "A daily selection, prepared with care."), meta: copy("ابتداءً من ١٤ ر.س", "From SAR 14") },
    { title: copy("شيء حلو", "A little something sweet"), description: copy("حلويات خفيفة لتكمل لحظتك.", "A small sweet to round out your visit."), meta: copy("ابتداءً من ٢٢ ر.س", "From SAR 22") },
  ],
  story: [
    { title: copy("مكان للقاءات البسيطة", "A place for the everyday"), description: copy("نموذج قصة تجريبي عن مساحة تجمع الناس حول لحظات يومية جميلة.", "An illustrative story about a welcoming space for everyday moments.") },
  ],
  "opening-hours": [
    { title: copy("أوقات الزيارة", "When to visit"), description: copy("الأحد إلى الخميس · ٧:٠٠ ص – ١١:٠٠ م", "Sunday to Thursday · 7:00 am – 11:00 pm"), meta: copy("الجمعة والسبت · ٨:٠٠ ص – ١٢:٠٠ ص", "Friday and Saturday · 8:00 am – 12:00 am") },
  ],
  locations: [
    { title: copy("زورونا", "Come by"), description: copy("أضف عنوان الفرع أو رابط الموقع بعد تأكيده.", "Add a confirmed branch address or location link.") },
  ],
  catalog: [
    { title: copy("اختيارات الموسم", "Seasonal picks"), description: copy("منتجات مختارة بعناية لتناسب يومك.", "A considered selection to make your day a little better."), meta: copy("تعرّف على التفاصيل", "Explore the details") },
    { title: copy("أساسيات يومية", "Everyday essentials"), description: copy("خيارات عملية بتفاصيل واضحة.", "Useful choices, presented with clarity."), meta: copy("تعرّف على التفاصيل", "Explore the details") },
    { title: copy("هدايا صغيرة", "Thoughtful gifts"), description: copy("أفكار بسيطة لمناسبة قريبة.", "Small ideas for the next occasion."), meta: copy("تعرّف على التفاصيل", "Explore the details") },
  ],
  "featured-services": [
    { title: copy("عناية شخصية", "Personal care"), description: copy("خدمة مصممة لتناسب وقتك وتفضيلاتك.", "A service shaped around your time and preferences.") },
    { title: copy("استشارة أولية", "A first conversation"), description: copy("تعرّف على الخيارات قبل اتخاذ القرار.", "Explore your options before making a decision.") },
  ],
  "lawyer-intro": [
    { title: copy("تعريف مهني", "Professional introduction"), description: copy("هذه مساحة تعريفية تجريبية. أضف نبذة المحامي أو المكتب بعد مراجعتها واعتمادها.", "This is sample introduction copy. Add a reviewed and approved biography for the lawyer or firm.") },
  ],
  "practice-areas": [
    { title: copy("استشارات الشركات", "Business counsel"), description: copy("مثال تجريبي على مجال ممارسة؛ يُستبدل بما يقدمه المكتب فعلياً.", "Illustrative practice-area example; replace with services actually offered by the firm.") },
    { title: copy("العقود والاتفاقيات", "Contracts and agreements"), description: copy("مثال تجريبي — تأكد من ملاءمته لنطاق عمل المكتب.", "Illustrative example — confirm it matches the firm’s actual scope.") },
    { title: copy("المنازعات التجارية", "Commercial disputes"), description: copy("مثال تجريبي لمجال خدمة قانونية.", "An illustrative legal-service example.") },
  ],
  qualifications: [
    { title: copy("المؤهلات والخبرة", "Qualifications & experience"), description: copy("أضف المؤهلات الأكاديمية والخبرات المهنية بعد التحقق منها. لا توجد بيانات اعتماد في هذا النموذج التجريبي.", "Add academic qualifications and professional experience once verified. No credentials are claimed in this demo.") },
  ],
  consultation: [
    { title: copy("ابدأ بمحادثة", "Start with a conversation"), description: copy("شارك موضوع استفسارك عبر خيارات التواصل المتاحة. لا تُرسل هذه المعاينة أي بيانات.", "Share the topic of your enquiry through the contact options available. This preview does not submit information.") },
  ],
  articles: [
    { title: copy("معلومة قانونية", "A legal note"), description: copy("مساحة لمقال يراجعه مختص قبل النشر. هذا النص التجريبي ليس مشورة قانونية.", "Space for an article reviewed by a qualified professional before publication. This demo is not legal advice.") },
    { title: copy("أسئلة شائعة", "Common questions"), description: copy("أضف إجابات عامة ومدققة، مع توضيح الحالات التي تستلزم استشارة مباشرة.", "Add reviewed general information and clarify when direct advice may be needed.") },
  ],
  accreditation: [
    { title: copy("الترخيص والاعتماد", "License & accreditation"), description: copy("تُضاف بيانات الترخيص أو الاعتماد هنا عند تزويدنا بمعلومات موثقة. لا توجد بيانات اعتماد مقدمة لهذا النموذج.", "Verified license or accreditation details can be added here when supplied. No credential details were provided for this demo.") },
  ],
};

const sectionTitles: Record<TemplateSectionType, Copy> = {
  hero: copy("مرحباً بك", "Welcome"),
  services: copy("ما نقدمه", "What we do"),
  projects: copy("من أعمالنا", "Selected work"),
  process: copy("طريقة العمل", "How we work"),
  benefits: copy("لماذا نحن", "Why work with us"),
  team: copy("فريقنا", "The people"),
  "case-studies": copy("قصص من العمل", "Work in context"),
  testimonials: copy("كلمات طيبة", "Kind words"),
  contact: copy("تواصل معنا", "Get in touch"),
  faq: copy("أسئلة شائعة", "Frequently asked"),
  menu: copy("من القائمة", "On the menu"),
  story: copy("قصتنا", "Our story"),
  gallery: copy("لمحة من المكان", "A closer look"),
  "opening-hours": copy("أوقات العمل", "Opening hours"),
  locations: copy("الموقع", "Find us"),
  "featured-services": copy("خدمات مختارة", "Featured services"),
  catalog: copy("تصفّح المجموعة", "Browse the collection"),
  "lawyer-intro": copy("عن المكتب", "About the firm"),
  "practice-areas": copy("مجالات الممارسة", "Practice areas"),
  qualifications: copy("المؤهلات والخبرة", "Qualifications & experience"),
  consultation: copy("طلب استشارة", "Consultation"),
  articles: copy("مقالات وإجابات", "Articles & answers"),
  accreditation: copy("الترخيص والاعتماد", "License & accreditation"),
};

const sectionIcon: Partial<Record<TemplateSectionType, typeof Wrench>> = {
  services: Wrench,
  projects: Building2,
  menu: UtensilsCrossed,
  "practice-areas": Scale,
  qualifications: BadgeCheck,
  consultation: CalendarDays,
  articles: FileText,
  accreditation: ShieldCheck,
  locations: MapPin,
  "opening-hours": Clock3,
};

function localized(value: unknown, language: TemplateLanguage, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const selected = record[language] ?? record.en ?? record.ar;
    if (typeof selected === "string" && selected.trim()) return selected.trim();
  }
  return fallback;
}

function sectionItems(section: TemplateSectionType, content: Record<string, unknown>): DemoItem[] {
  const possible = content.items ?? content.entries ?? content.cards;
  if (Array.isArray(possible)) {
    const parsed = possible.flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      return [{
        title: copy(
          localized(record.title, "ar", demoContent[section]?.[index]?.title.ar ?? "عنوان تجريبي"),
          localized(record.title, "en", demoContent[section]?.[index]?.title.en ?? "Demo title"),
        ),
        description: copy(
          localized(record.description, "ar", demoContent[section]?.[index]?.description.ar ?? "أضف وصفاً مناسباً لهذا القسم."),
          localized(record.description, "en", demoContent[section]?.[index]?.description.en ?? "Add a suitable description for this section."),
        ),
        meta: record.meta ? copy(localized(record.meta, "ar", ""), localized(record.meta, "en", "")) : undefined,
      }];
    });
    if (parsed.length) return parsed;
  }
  const defaults = demoContent[section] ?? [];
  return defaults.length ? defaults : [
    { title: copy("معلومات إضافية", "More information"), description: copy("أضف التفاصيل المناسبة لهذا القسم.", "Add the details that belong in this section.") },
  ];
}

function safeHref(value: string): string {
  return value.trim().replace(/[^\d+]/g, "");
}

function safeAppointmentHref(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function BrandMark({ category }: { category: string }) {
  const Icon = category === "law-firms-legal" ? Scale
    : category === "restaurants-cafes-juice" ? UtensilsCrossed
      : category === "contracting-real-estate" ? Building2
        : category === "services-maintenance" ? Hammer
          : category === "shops-personal-services" ? Sparkles
            : Compass;
  return <span className="tp-brand-mark" aria-hidden="true"><Icon size={18} strokeWidth={1.7} /></span>;
}

function ContactLinks({ customization, language }: { customization: TemplateCustomization; language: TemplateLanguage }) {
  const { phone, whatsapp, appointmentUrl, email, address } = customization.business;
  const appointment = safeAppointmentHref(appointmentUrl);
  const ar = language === "ar";
  return (
    <div className="tp-contact-actions">
      {phone && <a className="tp-contact-link" data-testid="link-preview-phone" href={`tel:${safeHref(phone)}`}><Phone size={16} aria-hidden="true" />{phone}</a>}
      {whatsapp && <a className="tp-contact-link" data-testid="link-preview-whatsapp" href={`https://wa.me/${safeHref(whatsapp).replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" />{ar ? "واتساب" : "WhatsApp"}</a>}
      {appointment && <a className="tp-contact-link" data-testid="link-preview-appointment" href={appointment} target="_blank" rel="noopener noreferrer"><CalendarDays size={16} aria-hidden="true" />{ar ? "حجز موعد" : "Book an appointment"}</a>}
      {email && <a className="tp-contact-link" data-testid="link-preview-email" href={`mailto:${email}`}><ArrowUpRight size={16} aria-hidden="true" />{email}</a>}
      {address && <span className="tp-contact-link"><MapPin size={16} aria-hidden="true" />{localized(address, language, ar ? "العنوان" : "Address")}</span>}
      {!phone && !whatsapp && !appointment && !email && !address && <p className="tp-contact-placeholder">{ar ? "أضف بيانات التواصل والعنوان بعد اعتمادها." : "Add confirmed contact details and address here."}</p>}
    </div>
  );
}

function Hero({ template, language, customization, content, hasContact }: TemplatePreviewProps & { content: Record<string, unknown>; hasContact: boolean }) {
  const ar = language === "ar";
  const name = localized(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name");
  const tagline = localized(content.tagline ?? customization.business.tagline, language, ar ? "خدمة واضحة، واهتمام بكل تفصيل." : "Clear service, considered in every detail.");
  const description = localized(content.description ?? customization.business.description, language, ar
    ? "نساعدك بخطوات عملية وخبرة قريبة من احتياجك."
    : "Practical support, shaped around what matters to you.");
  const image = customization.images.hero;
  return (
    <section className={`tp-hero tp-hero-${template.category}`} aria-labelledby="tp-hero-title">
      <div className="tp-hero-copy">
        <span className="tp-eyebrow"><span className="tp-eyebrow-rule" />{ar ? "نموذج تجريبي" : "DEMO PREVIEW"}</span>
        <h1 id="tp-hero-title">{localized(content.title, language, name)}<span>{tagline}</span></h1>
        <p>{description}</p>
        {hasContact && <a className="tp-primary-cta" data-testid="link-preview-hero-contact" href="#tp-contact">{ar ? "لنتحدث" : "Let’s talk"}{ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}</a>}
        <span className="tp-demo-note"><Check size={14} aria-hidden="true" />{ar ? "محتوى توضيحي قابل للتخصيص" : "Illustrative copy, ready to customize"}</span>
      </div>
      <div className="tp-hero-art" aria-label={ar ? "عنصر بصري تجريبي" : "Illustrative visual"}>
        {image
          ? <img src={image.src} alt={localized(image.alt, language, name)} />
          : <div className="tp-art-composition" aria-hidden="true">
            <span className="tp-art-orbit" /><span className="tp-art-shape tp-art-shape-one" /><span className="tp-art-shape tp-art-shape-two" />
            <span className="tp-art-letter">{template.category === "law-firms-legal" ? "§" : template.category === "restaurants-cafes-juice" ? "01" : "W"}</span>
            <span className="tp-art-caption">{ar ? "عمل محلي، حضور واضح" : "Local work. Clear presence."}</span>
          </div>}
        <span className="tp-art-index">{template.category === "law-firms-legal" ? "01 / 06" : "EST. FOR YOUR BUSINESS"}</span>
      </div>
    </section>
  );
}

function ContentSection({ type, language, customization, content, index }: {
  type: TemplateSectionType;
  language: TemplateLanguage;
  customization: TemplateCustomization;
  content: Record<string, unknown>;
  index: number;
}) {
  const ar = language === "ar";
  const title = localized(content.heading ?? content.title, language, sectionTitles[type][language]);
  const intro = localized(content.intro ?? content.description, language, "");
  const items = sectionItems(type, content);
  const Icon = sectionIcon[type] ?? Star;
  const legal = ["lawyer-intro", "practice-areas", "qualifications", "consultation", "articles", "accreditation"].includes(type);
  if (type === "contact") {
    return (
      <section className={`tp-section tp-contact-section tp-section-${type}`} id="tp-contact" data-testid={`section-preview-${type}-${index}`} aria-labelledby={`tp-section-${index}`}>
        <div className="tp-section-heading">
          <span className="tp-section-index">{String(index + 1).padStart(2, "0")} / {ar ? "تواصل" : "CONTACT"}</span>
          <h2 id={`tp-section-${index}`}>{title}</h2>
          <p>{intro || (ar ? "يسعدنا أن نسمع منك. اختر طريقة التواصل المناسبة." : "We’d be glad to hear from you. Choose the contact option that works for you.")}</p>
        </div>
        <ContactLinks customization={customization} language={language} />
      </section>
    );
  }
  if (type === "hero") return null;
  const variant = type === "menu" ? "tp-menu-section"
    : type === "projects" || type === "gallery" || type === "catalog" ? "tp-showcase-section"
      : type === "qualifications" || type === "accreditation" ? "tp-credential-section"
        : "";
  return (
    <section id={`tp-section-${index}`} className={`tp-section tp-section-${type} ${variant}`} data-testid={`section-preview-${type}-${index}`} aria-labelledby={`tp-section-${index}`}>
      <div className="tp-section-heading">
        <span className="tp-section-index">{String(index + 1).padStart(2, "0")} / {sectionTitles[type].en.toUpperCase()}</span>
        <h2 id={`tp-section-${index}`}>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {legal && <p className="tp-legal-demo">{ar ? "نص تجريبي — راجع المعلومات واعتمدها قبل النشر." : "Demo content — review and verify before publishing."}</p>}
      <div className={`tp-items tp-items-${type}`}>
        {items.map((item, itemIndex) => (
          <article className="tp-item" data-testid={`card-preview-${type}-${itemIndex + 1}`} key={`${type}-${itemIndex}`}>
            <span className="tp-item-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
            <div className="tp-item-copy">
              <h3>{item.title[language]}</h3>
              <p>{item.description[language]}</p>
              {item.meta && <span className="tp-item-meta">{item.meta[language]}</span>}
            </div>
            {(type === "menu" || type === "catalog") && <span className="tp-item-number">{String(itemIndex + 1).padStart(2, "0")}</span>}
          </article>
        ))}
      </div>
      {type === "consultation" && <div className="tp-consultation-contact"><ContactLinks customization={customization} language={language} /></div>}
      {type === "testimonials" && <span className="tp-demo-note"><ShieldCheck size={14} aria-hidden="true" />{demoLabel[language]}</span>}
      {type === "gallery" && customization.images.gallery.length > 0 && (
        <div className="tp-gallery" data-testid="gallery-preview">
          {customization.images.gallery.slice(0, 6).map((image, i) => (
            <img
              key={`${image.src}-${i}`}
              src={image.src}
              alt={localized(image.alt, language, "")}
              loading="lazy"
            />
          ))}
        </div>
      )}
      {type === "faq" && <span className="tp-faq-mark" aria-hidden="true"><ChevronDown size={17} /></span>}
    </section>
  );
}

export default function TemplatePreview({ template, language, customization }: TemplatePreviewProps) {
  const ar = language === "ar";
  const direction = ar ? "rtl" : "ltr";
  const businessName = localized(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name");
  const allowed = new Set(template.supportedSections);
  const configuredSections = customization.sections
    .filter((section) => allowed.has(section.type))
    .sort((a, b) => a.order - b.order);
  const visibleSections = configuredSections.length
    ? configuredSections.filter((section) => section.visible)
    : template.supportedSections.map((type, order) => ({
        id: `${template.slug}-${type}`,
        type,
        order,
        visible: true,
        content: {},
      }));
  const navigationSections = visibleSections.filter((section) => section.type !== "hero");
  const hasContactSection = visibleSections.some((section) => section.type === "contact");
  const navigationIndex = new Map(
    navigationSections.map((section, index) => [section.type, index + 1]),
  );
  const customColors = customization.brand.colors;
  const fontStack = (font: TemplateCustomization["brand"]["typography"]["body"]) => ({
    system: "system-ui, sans-serif",
    "arabic-sans": "'IBM Plex Sans Arabic', sans-serif",
    "editorial-serif": "Georgia, 'IBM Plex Sans Arabic', serif",
    "modern-sans": "'DM Sans', 'IBM Plex Sans Arabic', sans-serif",
  })[font];
  const styles = {
    "--tp-primary": customColors.primary,
    "--tp-secondary": customColors.secondary,
    "--tp-accent": customColors.accent,
    "--tp-background": customColors.background,
    "--tp-text": customColors.text,
    "--tp-heading-font": fontStack(customization.brand.typography.heading),
    "--tp-body-font": fontStack(customization.brand.typography.body),
  } as CSSProperties;

  return (
    <main id="tp-top" className={`tp-root tp-template-${template.category}`} data-testid={`template-preview-${template.category}`} dir={direction} lang={language} style={styles}>
      <div className="tp-demo-ribbon" data-testid="status-template-demo"><span>{ar ? "معاينة تجريبية" : "DEMO PREVIEW"}</span><span>{template.name[language]}</span></div>
      <header className="tp-header">
        <a className="tp-brand" data-testid="link-preview-brand" href="#tp-top" aria-label={businessName}>
          {customization.brand.logo
            ? <img className="tp-logo-image" src={customization.brand.logo.src} alt={localized(customization.brand.logo.alt, language, businessName)} />
            : <BrandMark category={template.category} />}
          <span>{businessName}</span>
        </a>
        <nav className="tp-nav" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>
          {navigationSections.slice(0, 4).map((section) => (
            <a
              key={section.id}
              data-testid={`link-preview-section-${section.type}-${navigationIndex.get(section.type)}`}
              href={section.type === "contact" ? "#tp-contact" : `#tp-section-${navigationIndex.get(section.type)}`}
            >
              {sectionTitles[section.type][language]}
            </a>
          ))}
        </nav>
        {hasContactSection && <a className="tp-header-contact" data-testid="link-preview-contact-header" href="#tp-contact">{ar ? "تواصل" : "Contact"}{ar ? <ArrowUpLeft size={15} /> : <ArrowUpRight size={15} />}</a>}
      </header>
      {template.category === "law-firms-legal" && (
        <aside className="tp-legal-notice" data-testid="notice-legal-demo"><Scale size={16} aria-hidden="true" /><span>{ar ? "معاينة توضيحية فقط — لا تتضمن مشورة قانونية أو بيانات اعتماد مؤكدة." : "Illustrative preview only — no legal advice or verified credentials are provided."}</span></aside>
      )}
      <div className="tp-content-wrap">
        {visibleSections.map((section) => section.type === "hero"
          ? <Hero key={section.id} template={template} language={language} customization={customization} content={section.content} hasContact={hasContactSection} />
          : <ContentSection
              key={section.id}
              type={section.type}
              language={language}
              customization={customization}
              content={section.content}
              index={navigationIndex.get(section.type) ?? 1}
            />)}
      </div>
      <footer className="tp-footer">
        <a className="tp-brand tp-footer-brand" data-testid="link-preview-footer-brand" href="#tp-top"><BrandMark category={template.category} /><span>{businessName}</span></a>
        <span>{ar ? "محتوى تجريبي للمعاينة — لا يمثل سجلاً تجارياً حقيقياً." : "Demo preview content — no real business record is represented."}</span>
        <a href="#tp-top" className="tp-back-top" data-testid="link-preview-top">{ar ? "للأعلى" : "Back to top"}<ArrowUpRight size={14} /></a>
      </footer>
    </main>
  );
}
