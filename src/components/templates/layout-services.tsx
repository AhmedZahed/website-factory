import {
  AirVent,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bug,
  ChevronRight,
  ClipboardList,
  Droplets,
  House,
  MapPin,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import {
  ContactActions,
  ContactSection,
  DataNote,
  DemoImage,
  OwnerPrompt,
  PreviewFooter,
  SectionHeading,
  SectionAttrs,
  itemsFor,
  sectionAnchor,
  sectionLabel,
  sectionTarget,
  text,
  type PreviewProps,
} from "./preview-shared";
import "./services-maintenance-template.css";

const serviceIcons = [AirVent, Droplets, Zap, Sparkles, Bug, House, Wrench];

function ServiceNavigation({ sections, language }: Pick<PreviewProps, "language"> & { sections: PreviewProps["sections"] }) {
  const ar = language === "ar";
  return <nav className="tp-layout-nav" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"} data-testid="nav-services-sections">
    {sections.filter((section) => section.type !== "hero").map((section) =>
      <a
        key={section.id}
        href={`#${sectionAnchor(section.type)}`}
        data-testid={`link-services-nav-${section.type}`}
      >
        {sectionLabel(section.type, language)}
      </a>)}
  </nav>;
}

function ServiceHeroCopy({ section, language, customization, contactTarget, contactVisible }: {
  section: PreviewProps["sections"][number];
  language: PreviewProps["language"];
  customization: PreviewProps["customization"];
  contactTarget: string;
  contactVisible: boolean;
}) {
  const ar = language === "ar";
  const title = text(section.content.title, language, text(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name"));
  const tagline = text(section.content.tagline ?? customization.business.tagline, language, ar ? "أضف عبارة تعريفية معتمدة." : "Add an approved service message.");
  const description = text(section.content.description ?? customization.business.description, language, ar ? "أضف نبذة نشاطك المعتمدة هنا." : "Add your approved business introduction here.");
  return <div className="tp-layout-hero-copy">
    <span className="tp-layout-kicker">{ar ? "الخدمات والصيانة" : "SERVICE & MAINTENANCE"}</span>
    <h1>{title}<em>{tagline}</em></h1>
    <p>{description}</p>
    {contactVisible && <a className="tp-layout-cta" href={contactTarget} data-testid="link-services-hero-request">
      {ar ? "صف ما تحتاجه" : "Tell us what you need"}
      {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
    </a>}
  </div>;
}

export default function ServicesLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const contactVisible = sections.some((section) => section.type === "contact");
  const contactTarget = sectionTarget(sections, "contact");
  return <main
    style={styles}
    className="tp-root tp-layout tp-layout-service"
    data-template-layout="services-maintenance"
    data-testid="template-preview-services-maintenance"
    dir={ar ? "rtl" : "ltr"}
    lang={language}
    id="tp-top"
  >
    <div className="tp-demo-ribbon">
      <span>{ar ? "ملف خدمة محلي" : "LOCAL SERVICE PROFILE"}</span>
      <span>{template.name[language]}</span>
    </div>
    <header className="tp-service-header">
      <a className="tp-service-brand" href="#tp-top" data-testid="link-services-brand">
        {customization.brand.logo
          ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} />
          : <span className="tp-service-brand-icon"><Wrench aria-hidden="true" /></span>}
        <span>{customization.business.name[language] || (ar ? "اسم النشاط" : "Business name")}</span>
      </a>
      <ServiceNavigation sections={sections} language={language} />
      {contactVisible && <a className="tp-service-request" href={contactTarget} data-testid="link-services-header-request">
        <ClipboardList aria-hidden="true" />
        {ar ? "اطلب خدمة" : "Request a service"}
        <ArrowUpRight aria-hidden="true" />
      </a>}
    </header>

    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-service-hero" data-testid="section-preview-hero">
        <div className="tp-service-hero-text">
          <ServiceHeroCopy
            section={section}
            language={language}
            customization={customization}
            contactTarget={contactTarget}
            contactVisible={contactVisible}
          />
          <span className="tp-service-guarantee">
            <ClipboardList aria-hidden="true" />
            {ar ? "أضف خطوات طلب الخدمة ومواعيد الاستجابة المعتمدة" : "Add your confirmed request steps and response times"}
          </span>
        </div>
        <DemoImage customization={customization} language={language} variant="service" />
      </section>;

      const props = SectionAttrs({ section, index, className: "tp-service-block" });
      if (section.type === "services") {
        const items = itemsFor(section, language);
        return <section key={section.id} {...props}>
          <SectionHeading section={section} language={language} kicker={ar ? "ما الذي يحتاج إلى عناية؟" : "WHAT NEEDS ATTENTION?"} />
          {items.length ? <div className="tp-service-list">
            {items.map((item, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              return <article className="tp-service-row" key={`${item.title}-${i}`} data-testid={`card-services-category-${i + 1}`}>
                <span className="tp-service-row-number"><Icon aria-hidden="true" /></span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
                {contactVisible && <a href={contactTarget} aria-label={ar ? `استفسر عن ${item.title}` : `Ask about ${item.title}`} data-testid={`link-services-category-request-${i + 1}`}>
                  <ChevronRight aria-hidden="true" />
                </a>}
              </article>;
            })}
          </div> : <OwnerPrompt>{ar ? "أضف الخدمات التي يقدمها فريقك، مثل التكييف أو السباكة أو الكهرباء." : "Add the services your team offers, such as HVAC, plumbing, or electrical work."}</OwnerPrompt>}
        </section>;
      }
      if (section.type === "benefits" || section.type === "process") {
        const items = itemsFor(section, language);
        return <section key={section.id} {...props}>
          <SectionHeading
            section={section}
            language={language}
            kicker={section.type === "process"
              ? (ar ? "من الطلب إلى الإنجاز" : "FROM REQUEST TO DONE")
              : (ar ? "ما يهم في كل زيارة" : "THE DETAILS THAT MATTER")}
          />
          {items.length ? <div className="tp-service-steps">{items.map((item, i) =>
            <article key={`${item.title}-${i}`} data-testid={`card-services-${section.type}-${i + 1}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>)}</div>
            : <OwnerPrompt>{ar ? "أضف خطوات العمل أو التفاصيل التي تميز طريقة خدمتك." : "Add your service steps or the practical details that define your approach."}</OwnerPrompt>}
        </section>;
      }
      if (section.type === "testimonials") {
        const reviews = itemsFor(section, language);
        return <section key={section.id} {...props}>
          <SectionHeading section={section} language={language} kicker={ar ? "آراء العملاء" : "CUSTOMER VOICES"} />
          {reviews.length ? <>
            <div className="tp-service-reviews">{reviews.map((review, i) =>
              <article key={`${review.title}-${i}`} data-testid={`card-services-review-${i + 1}`}>
                <span className="tp-review-mark" aria-hidden="true">“</span>
                <p>{review.description}</p>
                <strong>{review.title}</strong>
                <small>{ar ? "مراجعة أدخلها صاحب النشاط" : "Owner-entered review"}</small>
              </article>)}</div>
            <DataNote language={language}>
              {ar
                ? "تأكد من صحة المراجعات وموافقة أصحابها قبل النشر."
                : "Confirm each review is genuine and approved by its author before publishing."}
            </DataNote>
          </> : <div className="tp-review-empty">
            <span className="tp-review-mark" aria-hidden="true">“</span>
            <div>
              <h3>{ar ? "مساحة لمراجعات أصحابها" : "A place for real customer feedback"}</h3>
              <DataNote language={language}>
                {ar
                  ? "هذه مساحة توضيحية فقط. أضف مراجعات حقيقية أدخلها صاحب النشاط وبموافقة أصحابها."
                  : "Demo placeholder — add genuine, owner-entered reviews only with each customer's permission."}
              </DataNote>
            </div>
          </div>}
        </section>;
      }
      if (section.type === "locations") {
        const areas = itemsFor(section, language);
        return <section key={section.id} {...props}>
          <SectionHeading section={section} language={language} kicker={ar ? "نطاق الخدمة" : "SERVICE AREA"} />
          <div className="tp-service-locations">
            <p className="tp-service-location-intro">
              {ar ? "وضّح الأحياء أو المدن التي يستطيع فريقك خدمتها." : "Show customers the neighborhoods and towns your team can reach."}
            </p>
            {areas.length
              ? <div className="tp-service-area-list">{areas.map((area, i) =>
                  <div className="tp-service-area" key={`${area.title}-${i}`} data-testid={`text-services-area-${i + 1}`}>
                  <MapPin aria-hidden="true" />
                  <span>{area.title}</span>
                </div>)}</div>
              : <OwnerPrompt>{ar ? "أضف المدن أو الأحياء التي تغطيها الخدمة." : "Add the towns or neighborhoods covered by your service."}</OwnerPrompt>}
          </div>
        </section>;
      }
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="service" />;
      if (section.type === "faq") {
        const items = itemsFor(section, language);
        return <section key={section.id} {...props}>
          <SectionHeading section={section} language={language} kicker={ar ? "قبل إرسال الطلب" : "BEFORE YOU REQUEST"} />
          {items.length
              ? <div className="tp-service-faq">{items.map((item, i) =>
              <details key={`${item.title}-${i}`} data-testid={`item-services-faq-${i + 1}`}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.description}</p></details>)}</div>
            : <OwnerPrompt>{ar ? "أضف إجابات واضحة عن الأسعار، المواعيد، ونطاق الخدمة." : "Add clear answers about pricing, availability, and service scope."}</OwnerPrompt>}
        </section>;
      }
      return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} />
        {itemsFor(section, language).length
          ? <div className="tp-service-list">{itemsFor(section, language).map((item, i) =>
            <article className="tp-service-row" key={`${item.title}-${i}`}><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
          : <OwnerPrompt>{ar ? "أضف تفاصيل هذا القسم المعتمدة من نشاطك." : "Add business-approved details for this section."}</OwnerPrompt>}
      </section>;
    })}

    <footer className="tp-service-footer">
      <span>{ar ? "أخبرنا بما يحتاج إلى عناية" : "Tell us what needs attention"}</span>
      <ContactActions customization={customization} language={language} />
    </footer>
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
