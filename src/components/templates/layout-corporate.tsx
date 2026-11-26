import { ArrowUpRight, BadgeCheck, CircleDot, ShieldCheck } from "lucide-react";
import {
      ContactSection, DataNote, DemoImage, HeroCopy, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, type PreviewProps,
} from "./preview-shared";

export default function CorporateLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-corporate" data-template-layout="corporate-professional" data-testid="template-preview-corporate-professional" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "ملف تعريفي" : "ORGANIZATION PROFILE"}</span><span>{template.name[language]}</span></div>
    <header className="tp-corp-header"><a href="#tp-top" className="tp-corp-brand">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <CircleDot />}{customization.business.name[language]}</a><SectionNav sections={sections} language={language} /><a href={contactTarget} className="tp-corp-cta">{ar ? "تواصل مهني" : "Connect"}<ArrowUpRight /></a></header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-corp-hero">
        <div className="tp-corp-hero-copy"><span className="tp-layout-kicker">{ar ? "ملف الأعمال" : "BUSINESS PROFILE"}</span><HeroCopy section={section} language={language} customization={customization} ctaHref={contactTarget} />
          <div className="tp-corp-trust-line"><ShieldCheck /><span>{ar ? "أضف بيانات المؤسسة المعتمدة." : "Add verified organization details."}</span></div>
          <div className="tp-corp-proof-note"><DataNote language={language}>{ar ? "أضف مؤهلات المؤسسة ومؤشرات ثقة العملاء بعد توثيقها." : "Add verified organizational credentials and client trust indicators here."}</DataNote></div>
        </div><div className="tp-corp-hero-visual"><DemoImage customization={customization} language={language} variant="corporate" /><span className="tp-corp-monogram">{customization.business.name[language]?.slice(0, 1)}</span></div>
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-corp-section" });
      if (section.type === "services" || section.type === "benefits") return <section key={section.id} {...props}>
        <div className="tp-corp-section-intro"><SectionHeading section={section} language={language} kicker={ar ? "الخدمات" : "SERVICES"} /></div>
        <div className="tp-corp-service-table">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span className="tp-corp-ordinal">0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p><ArrowUpRight /></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف الخدمات المهنية ونطاقها المعتمد." : "Add your approved professional services and scope."}</OwnerPrompt>}
        </div>
      </section>;
      if (section.type === "team") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "الأشخاص وراء العمل" : "PEOPLE BEHIND THE WORK"} />
        <div className="tp-corp-team">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span className="tp-corp-avatar">{item.title.slice(0, 1)}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف أسماء الفريق وأدوارهم بعد التأكد من موافقتهم." : "Add team members and roles once confirmed with their permission."}</OwnerPrompt>}</div>
      </section>;
      if (section.type === "case-studies" || section.type === "projects") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "العمل في سياقه" : "WORK IN CONTEXT"} />
        <div className="tp-corp-cases">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><DemoImage customization={customization} language={language} variant="corporate" index={i + 1} /><div><span>CASE NOTE / 0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف حالات عمل حقيقية بعد توثيق تفاصيلها وموافقتها." : "Add real case studies once details and permissions are confirmed."}</OwnerPrompt>}</div>
      </section>;
      if (section.type === "testimonials") return <section key={section.id} {...props}><SectionHeading section={section} language={language} kicker={ar ? "ثقة متبادلة" : "CLIENT TRUST"} /><DataNote language={language}>{ar ? "أضف مؤشرات الثقة أو شهادات العملاء بعد توثيقها." : "Add client trust indicators or testimonials once verified."}</DataNote></section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="corporate" />;
      if (section.type === "faq") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-corp-faq">{itemsFor(section, language).map((item, i) => <details key={i}><summary>{item.title}</summary><p>{item.description}</p></details>)}</div></section>;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><DataNote language={language}><BadgeCheck />{ar ? "أضف المعلومات المعتمدة من مؤسستك." : "Add information approved by your organization."}</DataNote></section>;
    })}
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
