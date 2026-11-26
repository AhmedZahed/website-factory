import { ArrowUpRight, ChevronRight, ClipboardList, Wrench } from "lucide-react";
import {
  ContactActions, ContactSection, DataNote, DemoImage, HeroCopy, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, type PreviewProps,
} from "./preview-shared";

export default function ServicesLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-service" data-template-layout="services-maintenance" data-testid="template-preview-services-maintenance" dir={language === "ar" ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "موقع النشاط" : "LOCAL SERVICE PROFILE"}</span><span>{template.name[language]}</span></div>
    <header className="tp-service-header">
      <a className="tp-service-brand" href="#tp-top">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <span className="tp-service-brand-icon"><Wrench /></span>}
        <span>{customization.business.name[language] || (ar ? "اسم النشاط" : "Business name")}</span></a>
      <SectionNav sections={sections} language={language} />
      <a className="tp-service-request" href={contactTarget}><ClipboardList />{ar ? "اطلب خدمة" : "Request service"}<ArrowUpRight /></a>
    </header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-service-hero">
        <div className="tp-service-hero-text"><HeroCopy section={section} language={language} customization={customization} ctaHref={contactTarget} />
          <span className="tp-service-guarantee"><ClipboardList />{ar ? "أضف خطوات طلب الخدمة" : "Add your service-request steps"}</span>
        </div><DemoImage customization={customization} language={language} variant="service" />
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-service-block" });
      if (section.type === "services") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "اختر ما تحتاجه" : "SERVICE CATEGORIES"} />
        <div className="tp-service-list">{itemsFor(section, language).map((item, i) => <article className="tp-service-row" key={`${item.title}-${i}`}>
          <span className="tp-service-row-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><a href={contactTarget} aria-label={ar ? `استفسر عن ${item.title}` : `Ask about ${item.title}`}><ChevronRight /></a>
        </article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف فئات الخدمات التي يقدمها نشاطك." : "Add the service categories your business offers."}</OwnerPrompt>}
        </div>
      </section>;
      if (section.type === "benefits" || section.type === "process") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={section.type === "process" ? (ar ? "ببساطة" : "A SIMPLE PROCESS") : (ar ? "معايير عملك" : "YOUR SERVICE STANDARD")} />
        <div className="tp-service-steps">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>;
      if (section.type === "testimonials") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "تجارب موثقة" : "VERIFIED REVIEWS"} />
        <div className="tp-review-empty"><span className="tp-review-mark">“</span><div><h3>{ar ? "آراء عملائك هنا" : "Your customers’ words, here"}</h3><DataNote language={language}>{ar ? "أضف مراجعات حقيقية بعد موافقة أصحابها. لا توجد اقتباسات في هذه المعاينة." : "Add genuine reviews with the authors’ permission. No customer quotes are included in this preview."}</DataNote></div></div>
      </section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="service" />;
      if (section.type === "faq") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "قبل أن تبدأ" : "GOOD TO KNOW"} />
        <div className="tp-service-faq">{itemsFor(section, language).map((item, i) => <details key={`${item.title}-${i}`}><summary>{item.title}<span>+</span></summary><p>{item.description}</p></details>)}</div>
      </section>;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-service-list">{itemsFor(section, language).map((item, i) => <article className="tp-service-row" key={i}><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>;
    })}
    <footer className="tp-service-footer"><span>{ar ? "جاهزون لسماع احتياجك" : "Ready to hear what you need"}</span><ContactActions customization={customization} language={language} /></footer>
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
