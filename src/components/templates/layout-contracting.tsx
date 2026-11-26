import { ArrowUpRight, Building2, Ruler, ScanLine } from "lucide-react";
import {
  ContactSection, DataNote, DemoImage, HeroCopy, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, type PreviewProps,
} from "./preview-shared";

export default function ContractingLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-contract" data-template-layout="contracting-real-estate" data-testid="template-preview-contracting-real-estate" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "ملف المشاريع" : "PROJECT PORTFOLIO"}</span><span>{template.name[language]}</span></div>
    <header className="tp-contract-header"><a href="#tp-top" className="tp-contract-wordmark">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <Building2 />}{customization.business.name[language]}</a>
      <SectionNav sections={sections} language={language} /><a className="tp-contract-header-link" href={contactTarget}>{ar ? "استفسر عن مشروع" : "Discuss a project"}<ArrowUpRight /></a></header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-contract-hero">
        <div className="tp-contract-hero-copy"><span className="tp-layout-kicker">{ar ? "المقاولات والعقارات" : "BUILD / PLACE / PURPOSE"}</span><HeroCopy section={section} language={language} customization={customization} />
        </div><div className="tp-contract-hero-image"><DemoImage customization={customization} language={language} variant="architecture" /><span className="tp-image-overlay-label">{ar ? "مشروعك القادم" : "YOUR NEXT PROJECT"}</span></div>
        <div className="tp-contract-side-note"><span>01—06</span><p>{ar ? "مساحة لعرض المشاريع المعتمدة." : "A portfolio shaped around verified work."}</p></div>
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-contract-section" });
      if (section.type === "projects" || section.type === "gallery" || section.type === "case-studies") return <section key={section.id} {...props}>
        <div className="tp-contract-heading-row"><SectionHeading section={section} language={language} kicker={ar ? "اختيارات من الأعمال" : "SELECTED WORK"} /><span className="tp-contract-heading-index">01 <i /> 06</span></div>
        {section.type === "gallery" && customization.images.gallery.length > 0
          ? <div className="tp-contract-gallery">{customization.images.gallery.slice(0, 6).map((image, i) => <figure key={`${image.src}-${i}`}><img src={image.src} alt={image.alt[language]} loading="lazy" /><figcaption>{image.alt[language]}</figcaption></figure>)}</div>
          : <div className="tp-project-grid">{itemsFor(section, language).map((item, i) => <article className={`tp-project-card tp-project-card-${i % 3}`} key={`${item.title}-${i}`}>
              <DemoImage customization={customization} language={language} variant="architecture" index={i + 1} />
              <div className="tp-project-caption"><span>PROJECT / 0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></div>
            </article>)}
            {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف صوراً وتفاصيل لمشاريع اكتملت أو اعتمدت." : "Add imagery and details for completed, approved projects."}</OwnerPrompt>}
          </div>}
        <div className="tp-project-stats" aria-label={ar ? "مؤشرات المشاريع" : "Project indicators"}>
          {[
            ar ? "مشاريع مكتملة" : "Completed projects",
            ar ? "مساحة المشاريع" : "Project area",
            ar ? "سنوات الخبرة" : "Years of experience",
          ].map((label) => <div key={label}><strong>—</strong><span>{label}</span></div>)}
          <DataNote language={language}>{ar ? "أضف أرقاماً موثقة فقط بعد التحقق منها." : "Fill these with verified figures only after confirming the data."}</DataNote>
        </div>
        <DataNote language={language}>{ar ? "أضف المشاريع المنفذة بعد اعتماد الصور والتفاصيل." : "Publish completed projects only after confirming their images and details."}</DataNote>
      </section>;
      if (section.type === "services" || section.type === "process") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "قدراتنا" : "CAPABILITIES"} />
        <div className="tp-capability-list">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span><Ruler /></span><div><small>0{i + 1} / CAPABILITY</small><h3>{item.title}</h3><p>{item.description}</p></div><ScanLine /></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف مجالات العمل والخبرات المتاحة فعلياً." : "Add the capabilities your team actually provides."}</OwnerPrompt>}</div>
      </section>;
      if (section.type === "testimonials") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><DataNote language={language}>{ar ? "أضف مراجعات موثقة بموافقة أصحابها." : "Add verified client feedback with permission."}</DataNote></section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="contract" />;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-contract-facts">{itemsFor(section, language).map((item, i) => <article key={i}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>;
    })}
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
