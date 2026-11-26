import { ArrowUpRight, FileText, Scale, ShieldCheck } from "lucide-react";
import {
  ContactSection, DataNote, DemoImage, HeroCopy, OwnerPrompt, PreviewFooter, ProofPlaceholder,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, type PreviewProps,
} from "./preview-shared";

export default function LegalLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const consultationVisible = sections.some((section) => section.type === "consultation");
  const consultationTarget = sectionTarget(sections, "consultation");
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-legal" data-template-layout="law-firms-legal" data-testid="template-preview-law-firms-legal" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "ملف مهني توضيحي" : "PROFESSIONAL PREVIEW"}</span><span>{template.name[language]}</span></div>
    <header className="tp-legal-header"><a href="#tp-top" className="tp-legal-brand">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <span><Scale /></span>}
      <b>{customization.business.name[language]}</b><small>{ar ? "مكتب محاماة وخدمات قانونية" : "LAW & LEGAL SERVICES"}</small></a>
      <SectionNav sections={sections} language={language} /><a href={consultationVisible ? consultationTarget : contactTarget} className="tp-legal-cta">{consultationVisible ? (ar ? "تواصل للاستفسار" : "Make an inquiry") : (ar ? "خيارات التواصل" : "Contact options")}<ArrowUpRight /></a></header>
    <aside className="tp-legal-caveat"><ShieldCheck />{ar ? "معاينة توضيحية فقط — لا تتضمن مشورة قانونية أو مؤهلات أو بيانات اعتماد مؤكدة." : "Illustrative preview only — no legal advice, qualifications, or verified credentials are claimed."}</aside>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-legal-hero">
        <div className="tp-legal-hero-copy"><span className="tp-layout-kicker">{ar ? "خدمات قانونية" : "LEGAL COUNSEL / PROFILE"}</span><HeroCopy section={section} language={language} customization={customization} ctaHref={consultationVisible ? consultationTarget : contactTarget} ctaLabel={consultationVisible ? (ar ? "تواصل للاستفسار" : "Make an inquiry") : (ar ? "خيارات التواصل" : "Contact options")} />
          <span className="tp-legal-motto">{ar ? "أضف تعريف المكتب بعد مراجعته واعتماده." : "Add the firm’s reviewed and approved introduction."}</span></div>
        <div className="tp-legal-profile-art"><DemoImage customization={customization} language={language} variant="editorial" /><span className="tp-legal-seal"><Scale /></span></div>
        <div className="tp-legal-hero-index"><span>01</span><i />{ar ? "المكتب" : "THE FIRM"}</div>
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-legal-section" });
      if (section.type === "lawyer-intro") return <section key={section.id} {...props} className="tp-legal-intro">
        <div className="tp-legal-intro-label"><Scale /><span>{ar ? "عن المكتب" : "ABOUT THE FIRM"}</span></div>
        <div><SectionHeading section={section} language={language} /><div className="tp-legal-intro-copy">{itemsFor(section, language).map((item, i) => <p key={i}>{item.description}</p>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف نبذة المكتب بعد مراجعتها واعتمادها." : "Add the firm’s reviewed and approved introduction."}</OwnerPrompt>}</div></div>
      </section>;
      if (section.type === "practice-areas") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "مجالات العمل" : "AREAS OF PRACTICE"} />
        <div className="tp-legal-practice-list">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><ArrowUpRight /></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف مجالات الممارسة الفعلية بعد مراجعتها." : "Add the firm’s actual practice areas after review."}</OwnerPrompt>}</div>
      </section>;
      if (section.type === "qualifications" || section.type === "accreditation") return <section key={section.id} {...props} className="tp-legal-credentials">
        <div><span className="tp-layout-kicker">{ar ? "بيانات موثقة" : "VERIFIED DETAILS"}</span><SectionHeading section={section} language={language} /></div>
        <ProofPlaceholder language={language} label={section.type === "qualifications" ? (ar ? "المؤهلات والخبرات" : "qualifications and experience") : (ar ? "بيانات الترخيص والاعتماد" : "licensing and accreditation details")} />
      </section>;
      if (section.type === "consultation") return <section key={section.id} {...props} id="tp-consultation" className="tp-legal-consult">
        <div><span className="tp-layout-kicker">{ar ? "الخطوة التالية" : "NEXT STEP"}</span><SectionHeading section={section} language={language} /></div>
        <div className="tp-legal-consult-copy">{itemsFor(section, language).map((item, i) => <p key={i}>{item.description}</p>)}
          <a href={contactTarget} className="tp-legal-consult-link">{ar ? "خيارات التواصل" : "Contact options"}<ArrowUpRight /></a>
          <p className="tp-legal-note">{ar ? "لا تُرسل المعاينة بيانات أو طلبات." : "This preview does not submit information or consultation requests."}</p></div>
      </section>;
      if (section.type === "articles") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "مكتبة المكتب" : "FROM THE FIRM"} />
        <div className="tp-legal-articles">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span><FileText /></span><small>{ar ? "مادة تعريفية" : "INFORMATIONAL NOTE"} · 0{i + 1}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف مقالات يراجعها مختص قبل النشر." : "Add articles reviewed by a qualified professional before publication."}</OwnerPrompt>}</div>
        <DataNote language={language}>{ar ? "المحتوى المنشور لا يُعد مشورة قانونية." : "Published information is not legal advice."}</DataNote>
      </section>;
      if (section.type === "faq") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-legal-faq">{itemsFor(section, language).map((item, i) => <details key={i}><summary>{item.title}</summary><p>{item.description}</p></details>)}</div></section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="legal" />;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><OwnerPrompt>{ar ? "أضف معلومات المكتب التي تمت مراجعتها." : "Add firm information that has been reviewed."}</OwnerPrompt></section>;
    })}
    <footer className="tp-legal-disclaimer"><span><Scale />{customization.business.name[language]}</span><p>{ar ? "هذه المعاينة لا تقدم مشورة قانونية ولا تمثل مكتباً أو ترخيصاً حقيقياً." : "This preview does not provide legal advice or represent a real firm or license."}</p></footer>
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
