import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, Check, MapPin, Ruler, ScanLine } from "lucide-react";
import {
  ContactSection, DataNote, DemoImage, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionAttrs, itemsFor, sectionAnchor, sectionLabel, sectionTarget, text, type PreviewProps,
} from "./preview-shared";
import "./contracting-template.css";

type ContractItem = { title: string; description: string; category: string };
type ContractMetric = { label: string; value: string };

const conceptImages = new Set([
  "/images/contracting-residential-concept.jpg",
  "/images/contracting-commercial-concept.jpg",
  "/images/contracting-industrial-concept.jpg",
]);

function ContractNavigation({ sections, language }: Pick<PreviewProps, "language"> & { sections: PreviewProps["sections"] }) {
  const ar = language === "ar";
  return <nav className="tp-layout-nav" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"} data-testid="nav-contracting-sections">
    {sections.filter((section) => section.type !== "hero").map((section) =>
      <a key={section.id} href={`#${sectionAnchor(section.type)}`} data-testid={`link-contracting-nav-${section.type}`}>
        {sectionLabel(section.type, language)}
      </a>)}
  </nav>;
}

function ContractHeroCopy({ section, language, customization, contactTarget, contactVisible }: {
  section: PreviewProps["sections"][number];
  language: PreviewProps["language"];
  customization: PreviewProps["customization"];
  contactTarget: string;
  contactVisible: boolean;
}) {
  const ar = language === "ar";
  const title = text(section.content.title, language, text(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name"));
  const tagline = text(section.content.tagline ?? customization.business.tagline, language, ar ? "أضف عبارة تعريفية معتمدة." : "Add an approved business message.");
  const description = text(section.content.description ?? customization.business.description, language, ar ? "أضف نبذة النشاط المعتمدة هنا." : "Add the approved company introduction here.");
  return <div className="tp-layout-hero-copy">
    <h1>{title}<em>{tagline}</em></h1>
    <p>{description}</p>
    {contactVisible && <a className="tp-layout-cta" href={contactTarget} data-testid="link-contracting-hero-inquiry">
      {ar ? "ناقش مشروعك" : "Discuss your project"}
      {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
    </a>}
  </div>;
}

function metricsFor(section: PreviewProps["sections"][number], language: PreviewProps["language"]): ContractMetric[] {
  const raw = section.content.metrics;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const metric = entry as Record<string, unknown>;
    const label = text(metric.label ?? metric.title, language);
    const value = typeof metric.value === "number" ? String(metric.value) : text(metric.value, language);
    return label && value ? [{ label, value }] : [];
  });
}

function serviceAreasFor(section: PreviewProps["sections"][number], language: PreviewProps["language"]): string[] {
  const raw = section.content.serviceAreas ?? section.content.locations;
  const entries = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
  return entries.flatMap((entry) => {
    if (typeof entry === "string") return entry.trim() ? [entry.trim()] : [];
    if (!entry || typeof entry !== "object") return [];
    const area = entry as Record<string, unknown>;
    const label = text(area.label ?? area.title ?? area.name ?? entry, language);
    return label ? [label] : [];
  });
}

function isConceptImage(src: string | undefined) {
  return !!src && conceptImages.has(src);
}

export default function ContractingLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const contactVisible = sections.some((section) => section.type === "contact");
  const contactTarget = sectionTarget(sections, "contact");
  const [activeCategory, setActiveCategory] = useState("");

  return <main style={styles} className="tp-root tp-layout tp-layout-contract cf-root" data-template-layout="contracting-real-estate" data-testid="template-preview-contracting-real-estate" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="cf-edition"><span>{ar ? "قالب ملف معماري · صور توضيحية" : "ARCHITECTURE PORTFOLIO TEMPLATE · CONCEPT IMAGERY"}</span><span>{template.name[language]}</span></div>
    <header className="cf-header">
      <a href="#tp-top" className="cf-brand" aria-label={customization.business.name[language]}>
        {customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <span className="cf-brand-mark"><Building2 /></span>}
        <span>{customization.business.name[language]}</span>
      </a>
      <ContractNavigation sections={sections} language={language} />
      {contactVisible && <a className="cf-header-cta" href={contactTarget} data-testid="link-contracting-header-inquiry">
        {ar ? "ابدأ حواراً" : "Start a conversation"}<ArrowUpRight aria-hidden="true" />
      </a>}
    </header>

    {sections.map((section, index) => {
      if (section.type === "hero") {
        const heroSrc = customization.images.hero?.src;
        const heroLabel = isConceptImage(heroSrc)
          ? (ar ? "صورة مفاهيمية · قابلة للاستبدال" : "CONCEPT IMAGE · REPLACE WITH YOUR WORK")
          : heroSrc
            ? (ar ? "صورة رئيسية" : "PROJECT IMAGE")
            : (ar ? "أضف صورة المشروع الرئيسية" : "ADD A HERO PROJECT IMAGE");
        return <section key={section.id} id="tp-section-hero" className="cf-hero" data-testid="section-preview-hero">
        <div className="cf-hero-visual">
          <DemoImage customization={customization} language={language} variant="architecture" />
          <span className="cf-concept-flag">{heroLabel}</span>
          <span className="cf-hero-coordinate">{ar ? "تصميم · مكان · تنفيذ" : "DESIGN · PLACE · BUILD"}</span>
        </div>
        <div className="cf-hero-copy">
          <span className="tp-layout-kicker">{ar ? "المقاولات · التطوير · العمارة" : "BUILDING · DEVELOPMENT · DESIGN"}</span>
          <ContractHeroCopy section={section} language={language} customization={customization} contactTarget={contactTarget} contactVisible={contactVisible} />
          <div className="cf-hero-foot"><span>{ar ? "رؤية المكان تبدأ من هنا" : "A place begins with a point of view"}</span>{ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</div>
        </div>
        </section>;
      }

      const props = SectionAttrs({ section, index, className: "cf-section" });
      if (section.type === "projects") {
        const source = section.content.items ?? section.content.entries ?? section.content.cards;
        const rawEntries = Array.isArray(source) ? source as Record<string, unknown>[] : [];
        const entries: ContractItem[] = itemsFor(section, language).map((item, i) => ({
          ...item,
          category: text(rawEntries[i]?.category ?? rawEntries[i]?.meta, language, ar ? "مفاهيمي" : "Concept"),
        }));
        const categories = [...new Set(entries.map((entry) => entry.category))];
        const visibleEntries = entries
          .map((entry, originalIndex) => ({ entry, originalIndex }))
          .filter(({ entry }) => !activeCategory || entry.category === activeCategory);
        const metrics = metricsFor(section, language);
        const projectDescription = text(section.content.description ?? section.content.intro, language);
        const conceptContent = /concept|demo|illustrative|تصور|توضيحي/i.test(projectDescription)
          || entries.some((entry) => /concept|demo|illustrative|تصور|توضيحي/i.test(`${entry.title} ${entry.description}`));
        return <section key={section.id} {...props}>
          <div className="cf-project-intro">
            <div><span className="tp-layout-kicker">{conceptContent
              ? (ar ? "مختارات · صور مفاهيمية" : "SELECTED STUDIES · CONCEPT IMAGERY")
              : (ar ? "مشاريع مختارة" : "SELECTED PROJECTS")}</span><SectionHeading section={section} language={language} /></div>
            <p>{conceptContent
              ? (ar ? "أمثلة تصميمية وليست مشاريع منفذة. استبدل الصور والعناوين بمواد تملك حق عرضها." : "These are illustrative studies, not completed projects. Replace imagery and titles with work you are authorized to present.")
              : (ar ? "اعرض المشاريع المعتمدة فقط، مع التحقق من تفاصيلها وحقوق الصور قبل النشر." : "Show approved work only, after confirming project details and image usage rights.")}</p>
          </div>
          {categories.length > 1 && <div className="cf-filters" role="group" aria-label={ar ? "تصنيف المشاريع" : "Project categories"}>
            <button type="button" className={!activeCategory ? "is-active" : ""} onClick={() => setActiveCategory("")} data-testid="button-contracting-projects-all">{ar ? "الكل" : "All studies"}</button>
            {categories.map((category, i) => <button type="button" key={category} className={activeCategory === category ? "is-active" : ""} onClick={() => setActiveCategory(category)} data-testid={`button-contracting-category-${i + 1}`}>{category}</button>)}
          </div>}
          {visibleEntries.length ? <div className="cf-project-grid">
            {visibleEntries.map(({ entry, originalIndex }) => {
              const image = customization.images.gallery[originalIndex];
              const imageLabel = isConceptImage(image?.src)
                ? (ar ? "صورة مفاهيمية" : "CONCEPT IMAGE")
                : image
                  ? (ar ? "صورة المشروع" : "PROJECT IMAGE")
                  : (ar ? "أضف صورة" : "ADD IMAGE");
              return <article className={`cf-project-card cf-project-card-${originalIndex % 3}`} key={`${entry.title}-${originalIndex}`} data-testid={`card-contracting-project-${originalIndex + 1}`}>
                <div className="cf-project-image"><DemoImage customization={customization} language={language} variant="architecture" index={originalIndex + 1} /><span className="cf-image-demo">{imageLabel}</span></div>
                <div className="cf-project-caption"><span>{entry.category} <i /> {conceptContent ? (ar ? "مثال توضيحي" : "ILLUSTRATIVE EXAMPLE") : (ar ? "مشروع" : "PROJECT")}</span><h3>{entry.title}</h3><p>{entry.description}</p></div>
              </article>;
            })}
          </div> : entries.length
            ? <OwnerPrompt>{ar ? "لا توجد دراسات ضمن هذا التصنيف." : "There are no studies in this category."}</OwnerPrompt>
            : <OwnerPrompt>{ar ? "أضف مشاريع معتمدة، أو أخفِ هذا القسم حتى يصبح المحتوى جاهزاً." : "Add verified projects, or hide this section until the content is ready."}</OwnerPrompt>}
          <div className="cf-project-stats" data-testid="section-contracting-metrics">
            <span className="cf-stats-label">{metrics.length
              ? (ar ? "أرقام مقدمة من النشاط · راجعها قبل النشر" : "OWNER-SUPPLIED FIGURES · VERIFY BEFORE PUBLISHING")
              : (ar ? "موضع إحصاءات تجريبي · لا توجد أرقام مؤكدة" : "DEMO PLACEHOLDER · NO VERIFIED FIGURES PROVIDED")}</span>
            {(metrics.length ? metrics : [
              { label: ar ? "مشاريع منفذة" : "Completed projects", value: "—" },
              { label: ar ? "سنوات الخبرة" : "Years of experience", value: "—" },
              { label: ar ? "مساحة المشاريع" : "Project area", value: "—" },
            ]).map((metric, i) => <div key={`${metric.label}-${i}`} data-testid={`text-contracting-metric-${i + 1}`}>
              <strong>{metric.value}</strong><span>{metric.label}</span>
            </div>)}
            <DataNote language={language}>{metrics.length
              ? (ar ? "تحقق من صحة الأرقام ومصدرها قبل النشر." : "Confirm every figure and its source before publishing.")
              : (ar ? "أضف القيم الفعلية بعد التحقق منها؛ لا توجد إحصاءات مختلقة في المعاينة." : "Enter actual values only after verification; no fictional statistics are included.")}</DataNote>
          </div>
          <DataNote language={language}>{conceptContent
            ? (ar ? "الصور والتفاصيل الافتراضية توضيحية فقط وليست دليلاً على مشاريع منفذة." : "Default images and details are illustrative only and do not represent completed projects.")
            : (ar ? "تحقق من موافقات أصحاب المشاريع وحقوق الصور قبل النشر." : "Confirm project permissions and image usage rights before publishing.")}</DataNote>
        </section>;
      }

      if (section.type === "gallery") {
        const gallery = customization.images.gallery;
        const hasConceptImages = gallery.some((image) => isConceptImage(image.src));
        return <section key={section.id} {...props}>
          <div className="cf-gallery-head"><SectionHeading section={section} language={language} kicker={ar ? "مادة بصرية قابلة للتبديل" : "A VISUAL MATERIAL STUDY"} /><span className="cf-gallery-count">{String(gallery.length || 3).padStart(2, "0")} / {!gallery.length
            ? (ar ? "مواضع صور" : "IMAGE SLOTS")
            : hasConceptImages
              ? (ar ? "صور مفاهيمية" : "CONCEPT IMAGES")
              : (ar ? "صور المشاريع" : "PROJECT IMAGES")}</span></div>
          {gallery.length ? <div className="cf-gallery">
            {gallery.map((image, i) => <figure key={`${image.src}-${i}`} className={`cf-gallery-item cf-gallery-item-${i % 3}`}>
              <img src={image.src} alt={image.alt[language]} loading="lazy" />
              <figcaption><span>{isConceptImage(image.src)
                ? (ar ? "صورة مفاهيمية · استبدلها بصورتك" : "CONCEPT IMAGE · REPLACE WITH YOUR OWN")
                : image.alt[language]}</span><span>{String(i + 1).padStart(2, "0")}</span></figcaption>
            </figure>)}
          </div> : <div className="cf-gallery-default">
            <figure className="cf-gallery-item cf-gallery-item-0"><DemoImage customization={customization} language={language} variant="architecture" index={1} /><figcaption><span>{ar ? "أضف صورة سكنية" : "ADD RESIDENTIAL PROJECT IMAGE"}</span><span>01</span></figcaption></figure>
            <figure className="cf-gallery-item cf-gallery-item-1"><DemoImage customization={customization} language={language} variant="architecture" index={2} /><figcaption><span>{ar ? "أضف صورة تجارية" : "ADD COMMERCIAL PROJECT IMAGE"}</span><span>02</span></figcaption></figure>
            <figure className="cf-gallery-item cf-gallery-item-2"><DemoImage customization={customization} language={language} variant="architecture" index={3} /><figcaption><span>{ar ? "أضف صورة صناعية" : "ADD INDUSTRIAL PROJECT IMAGE"}</span><span>03</span></figcaption></figure>
          </div>}
          <DataNote language={language}>{hasConceptImages
            ? (ar ? "صور تصورية للمعاينة فقط. استبدلها بصور أصلية قبل النشر." : "Preview concepts only. Replace with original, approved photography before publishing.")
            : gallery.length
              ? (ar ? "تحقق من حقوق استخدام الصور قبل النشر." : "Confirm image usage rights before publishing.")
              : (ar ? "أضف الصور التي تملك حق استخدامها." : "Add project images you have permission to use.")}</DataNote>
        </section>;
      }

      if (section.type === "services") return <section key={section.id} {...props}>
        <div className="cf-services-layout">
          <div className="cf-services-aside"><span className="tp-layout-kicker">{ar ? "ما يمكن أن تقدمه" : "WHAT YOUR TEAM CAN DO"}</span><SectionHeading section={section} language={language} /><p>{ar ? "مجالات مرنة للمقاولين والمطورين وفرق التصميم. اعرض فقط نطاق الخدمات الذي تقدمه فعلياً." : "A flexible framework for contractors, developers and design teams. Show only the services your practice genuinely provides."}</p><span className="cf-aside-index">CAPABILITIES / 02</span></div>
          <div className="cf-capabilities">
            {itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span className="cf-cap-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><Ruler /></article>)}
            {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف الخدمات ونطاق العمل المعتمد." : "Add your confirmed services and scope of work."}</OwnerPrompt>}
          </div>
        </div>
      </section>;

      if (section.type === "process") return <section key={section.id} {...props}>
        <div className="cf-process-heading"><span className="tp-layout-kicker">{ar ? "من الفكرة إلى التسليم" : "FROM BRIEF TO HANDOVER"}</span><SectionHeading section={section} language={language} /><p>{ar ? "خطوات نموذجية قابلة للتعديل لتطابق آلية فريقك." : "A suggested sequence. Edit it to reflect how your team actually works."}</p></div>
        <div className="cf-process-list">
          {itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span className="cf-process-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><ScanLine /></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف مراحل التنفيذ المعتمدة." : "Add the confirmed stages of your delivery process."}</OwnerPrompt>}
        </div>
      </section>;

      if (section.type === "testimonials") {
        const testimonials = itemsFor(section, language);
        return <section key={section.id} {...props} className={`${props.className} cf-testimonials`}>
          <span className="tp-layout-kicker">{ar ? "الثقة تُكتسب" : "CREDIBILITY, EARNED"}</span><SectionHeading section={section} language={language} />
          {testimonials.length
            ? <div className="cf-testimonial-list">{testimonials.map((item, i) =>
              <article key={`${item.title}-${i}`} data-testid={`card-contracting-feedback-${i + 1}`}><span aria-hidden="true">“</span><p>{item.description}</p><strong>{item.title}</strong><small>{ar ? "محتوى أدخله صاحب النشاط" : "Owner-supplied feedback"}</small></article>)}
              <DataNote language={language}>{ar ? "تحقق من أن كل شهادة حقيقية وأن صاحبها وافق على نشرها." : "Confirm every testimonial is genuine and its author approved publication."}</DataNote>
            </div>
            : <div className="cf-testimonial-note"><span>“</span><div><h3>{ar ? "مساحة لشهادة موثقة" : "A place for verified feedback"}</h3><p>{ar ? "لا توجد شهادات افتراضية في هذه المعاينة. أضف اقتباساً حقيقياً بعد موافقة صاحبه." : "No sample testimonials are shown. Add genuine feedback only with the author's permission."}</p></div></div>}
        </section>;
      }

      if (section.type === "faq") return <section key={section.id} {...props}>
        <div className="cf-faq-heading"><span className="tp-layout-kicker">{ar ? "معلومات قبل البدء" : "BEFORE WE BEGIN"}</span><SectionHeading section={section} language={language} /></div>
        <div className="cf-faq-list">{itemsFor(section, language).map((item, i) => <details key={`${item.title}-${i}`} data-testid={`item-contracting-faq-${i + 1}`}><summary><span>{item.title}</span><span className="cf-faq-plus">+</span></summary><p>{item.description}</p></details>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف إجابات معتمدة للأسئلة المتكررة." : "Add approved answers to common project questions."}</OwnerPrompt>}</div>
      </section>;

      if (section.type === "contact") {
        const serviceAreas = serviceAreasFor(section, language);
        return <div className="cf-contact-wrap" key={section.id}>
          <span className="cf-contact-vertical">{ar ? "دعوة للمشروع القادم" : "A PROJECT STARTS WITH A CONVERSATION"}</span>
          {serviceAreas.length > 0 && <div className="cf-service-areas" data-testid="text-contracting-service-areas">
            <span>{ar ? "نطاق الخدمة" : "SERVICE AREAS"}</span>
            {serviceAreas.map((area, i) => <span key={`${area}-${i}`} data-testid={`text-contracting-service-area-${i + 1}`}><MapPin aria-hidden="true" />{area}</span>)}
          </div>}
          <ContactSection section={section} language={language} customization={customization} layout="contract cf-contact" />
        </div>;
      }

      return null;
    })}
    <footer className="cf-footer-note"><span>{ar ? "صور المفاهيمية قابلة للاستبدال · اعرض المشاريع والبيانات المعتمدة فقط." : "Concept imagery is replaceable · publish verified work and owner-supplied facts only."}</span><Check /></footer>
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
