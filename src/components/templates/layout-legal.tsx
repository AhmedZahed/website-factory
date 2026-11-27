import "./law-firm-template.css";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, FileText,
  Menu, MessageCircle, Scale, ShieldCheck,
} from "lucide-react";
import {
  ContactActions, DataNote, OwnerPrompt, SectionAttrs, SectionHeading,
  itemsFor, sectionAnchor, sectionLabel, sectionTarget, text, type PreviewProps,
} from "./preview-shared";

function LegalArtwork({ customization, language }: Pick<PreviewProps, "customization" | "language">) {
  const ar = language === "ar";
  const hero = customization.images.hero;
  const gallery = customization.images.gallery.slice(0, 3);

  return <div className="lf-artwork" data-testid="visual-legal-hero">
    {hero ? <div className="lf-artwork-photo">
      <img src={hero.src} alt={text(hero.alt, language, ar ? "صورة المكتب" : "Firm image")} />
      <span className="lf-artwork-photo-caption">{ar ? "المكتب" : "THE FIRM"}</span>
    </div> : <div className="lf-artwork-engraving" role="img" aria-label={ar ? "رسم زخرفي قانوني" : "Decorative legal illustration"}>
      <span className="lf-engraving-frame" />
      <span className="lf-engraving-orbit lf-orbit-one" />
      <span className="lf-engraving-orbit lf-orbit-two" />
      <span className="lf-engraving-pillar lf-pillar-left" />
      <span className="lf-engraving-pillar lf-pillar-right" />
      <span className="lf-engraving-capital" />
      <span className="lf-engraving-scales">
        <i className="lf-scale-stem" />
        <i className="lf-scale-beam" />
        <i className="lf-scale-pan lf-pan-left" />
        <i className="lf-scale-pan lf-pan-right" />
        <i className="lf-scale-base" />
      </span>
      <span className="lf-engraving-index">LAW<br />&amp; ORDER</span>
      <span className="lf-engraving-roman">§</span>
    </div>}
    {gallery.length > 0 && <div className="lf-gallery" aria-label={ar ? "صور المكتب" : "Firm image gallery"}>
      {gallery.map((image, index) => <img
        key={`${image.src}-${index}`}
        src={image.src}
        alt={text(image.alt, language, ar ? `صورة المكتب ${index + 1}` : `Firm image ${index + 1}`)}
        loading="lazy"
        data-testid={`img-legal-gallery-${index + 1}`}
      />)}
    </div>}
    <span className="lf-artwork-seal" aria-hidden="true"><Scale /></span>
    <span className="lf-artwork-caption">{ar ? "الوضوح · النزاهة · المسؤولية" : "CLARITY · INTEGRITY · RESPONSIBILITY"}</span>
  </div>;
}

function LegalHeader({ language, customization, sections, consultationTarget, contactTarget }: Pick<PreviewProps, "language" | "customization" | "sections"> & {
  consultationTarget: string;
  contactTarget: string;
}) {
  const ar = language === "ar";
  const navSections = sections.filter((section) => section.type !== "hero");
  const ctaTarget = sections.some((section) => section.type === "consultation") ? consultationTarget : contactTarget;
  const businessName = text(customization.business.name, language, ar ? "اسم المكتب القانوني" : "Law firm name");
  return <header className="lf-header">
    <a href="#tp-top" className="lf-brand" aria-label={businessName} data-testid="link-legal-brand">
      {customization.brand.logo
        ? <img src={customization.brand.logo.src} alt={text(customization.brand.logo.alt, language, businessName)} />
        : <span className="lf-brand-mark" aria-hidden="true"><Scale /></span>}
      <span className="lf-brand-copy"><b>{businessName}</b><small>{ar ? "مكتب محاماة وخدمات قانونية" : "LAW & LEGAL SERVICES"}</small></span>
    </a>
    <nav className="lf-desktop-nav" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>
      {navSections.map((section) => <a key={section.id} href={`#${sectionAnchor(section.type)}`} data-testid={`link-legal-nav-${section.type}`}>
        {sectionLabel(section.type, language)}
      </a>)}
    </nav>
    <a className="lf-header-cta" href={ctaTarget} data-testid="link-legal-header-cta">
      <span>{sections.some((section) => section.type === "consultation") ? (ar ? "تواصل للاستفسار" : "Make an inquiry") : (ar ? "خيارات التواصل" : "Contact options")}</span>
      {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
    </a>
    <details className="lf-mobile-menu">
      <summary aria-label={ar ? "فتح قائمة التنقل" : "Open navigation menu"} data-testid="button-legal-mobile-menu">
        <Menu className="lf-menu-icon" aria-hidden="true" /><ChevronDown className="lf-menu-chevron" aria-hidden="true" />
      </summary>
      <nav aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>
        {navSections.map((section) => <a key={section.id} href={`#${sectionAnchor(section.type)}`} data-testid={`link-legal-mobile-nav-${section.type}`}>
          {sectionLabel(section.type, language)}<ArrowUpRight aria-hidden="true" />
        </a>)}
      </nav>
    </details>
  </header>;
}

export default function LegalLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const consultationVisible = sections.some((section) => section.type === "consultation");
  const practiceAreasVisible = sections.some((section) => section.type === "practice-areas");
  const consultationTarget = sectionTarget(sections, "consultation");
  const contactTarget = sectionTarget(sections, "contact");
  const lawyerPortrait = customization.images.gallery.find((image) =>
    /(lawyer|attorney|portrait|محامي|محامية|المحامي)/i.test(
      `${text(image.alt, "en")} ${text(image.alt, "ar")}`,
    ),
  );
  return <main style={styles} className="tp-root tp-layout tp-layout-legal lf-legal" data-template-layout="law-firms-legal" data-testid="template-preview-law-firms-legal" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="lf-preview-ribbon" data-testid="text-legal-preview-status">
      <span>{ar ? "معاينة مهنية قابلة للتخصيص" : "EDITABLE PROFESSIONAL PREVIEW"}</span>
      <span>{template.name[language]}</span>
    </div>
    <LegalHeader language={language} customization={customization} sections={sections} consultationTarget={consultationTarget} contactTarget={contactTarget} />
    <aside className="lf-caveat" data-testid="text-legal-preview-disclaimer">
      <ShieldCheck aria-hidden="true" />
      <span>{ar ? "معاينة توضيحية فقط — لا تتضمن مشورة قانونية أو مؤهلات أو بيانات اعتماد مؤكدة." : "Illustrative preview only — no legal advice, qualifications, or verified credentials are claimed."}</span>
    </aside>
    {sections.map((section, index) => {
      if (section.type === "hero") {
        const title = text(section.content.title, language, text(customization.business.name, language, ar ? "اسم المكتب القانوني" : "Law firm name"));
        const tagline = text(section.content.tagline ?? customization.business.tagline, language, ar ? "أضف عبارة تعريفية معتمدة." : "Add an approved firm introduction.");
        const description = text(section.content.description ?? customization.business.description, language, ar ? "أضف نبذة المكتب بعد مراجعتها واعتمادها." : "Add the firm’s reviewed and approved introduction.");
        return <section key={section.id} className="lf-hero" data-testid="section-preview-hero">
          <div className="lf-hero-copy">
            <span className="lf-kicker"><i />{ar ? "خدمات قانونية · ملف المكتب" : "LEGAL COUNSEL · FIRM PROFILE"}</span>
            <h1>{title}<em>{tagline}</em></h1>
            <p>{description}</p>
            <div className="lf-hero-actions">
              <a className="lf-primary-link" href={consultationVisible ? consultationTarget : contactTarget} data-testid="link-legal-hero-contact">
                {consultationVisible ? (ar ? "تواصل للاستفسار" : "Discuss your inquiry") : (ar ? "خيارات التواصل" : "Contact options")}
                {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </a>
              {practiceAreasVisible && <a className="lf-secondary-link" href={sectionTarget(sections, "practice-areas")} data-testid="link-legal-hero-practice">
                {ar ? "استكشف مجالات العمل" : "Explore practice areas"}<ArrowDown aria-hidden="true" />
              </a>}
            </div>
            <span className="lf-hero-footnote">{ar ? "أضف التعريف المعتمد للمكتب قبل النشر." : "Firm introduction to be reviewed and approved before publishing."}</span>
          </div>
          <LegalArtwork customization={customization} language={language} />
          <div className="lf-hero-index"><span>01</span><i />{ar ? "المكتب" : "THE FIRM"}</div>
        </section>;
      }
      const props = SectionAttrs({ section, index, className: "lf-section" });
      if (section.type === "lawyer-intro") return <section key={section.id} {...props} className="lf-section lf-intro">
        <div className="lf-intro-aside">
          <span className="lf-aside-number">01</span>
          <span className="lf-aside-label">{ar ? "التعريف بالمكتب" : "THE FIRM"}</span>
        </div>
        <div className="lf-intro-main">
          <SectionHeading section={section} language={language} kicker={ar ? "عن المكتب" : "A CLOSER LOOK"} />
          <div className="lf-lawyer-profile">
            <figure className="lf-lawyer-portrait" data-testid="visual-legal-lawyer-profile">
              {lawyerPortrait
                ? <img
                    src={lawyerPortrait.src}
                    alt={text(lawyerPortrait.alt, language, ar ? "صورة المحامي" : "Lawyer portrait")}
                    loading="lazy"
                  />
                : <div role="img" aria-label={ar ? "مساحة لصورة المحامي" : "Lawyer portrait placeholder"}>
                    <Scale aria-hidden="true" />
                    <span>{ar ? "أضف صورة المحامي" : "Add an approved portrait"}</span>
                  </div>}
            </figure>
            <div className="lf-lawyer-profile-copy">
              <span className="lf-kicker">{ar ? "ملف المحامي" : "LAWYER PROFILE"}</span>
              {itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`} data-testid={`text-legal-intro-${i + 1}`}>
                {item.title && <h3>{item.title}</h3>}{item.description && <p>{item.description}</p>}
              </article>)}
              {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف اسم المحامي ونبذته المعتمدة ومجالات خبرته بعد مراجعتها. لا تُعرض تفاصيل غير مؤكدة." : "Add the lawyer’s name, approved profile, and reviewed experience. Do not include unverified details."}</OwnerPrompt>}
            </div>
          </div>
        </div>
      </section>;
      if (section.type === "practice-areas") return <section key={section.id} {...props} className="lf-section lf-practices">
        <SectionHeading section={section} language={language} kicker={ar ? "مجالات العمل" : "AREAS OF PRACTICE"} />
        <div className="lf-practice-grid">
          {itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`} className="lf-practice-card" data-testid={`card-legal-practice-${i + 1}`}>
            <span className="lf-card-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="lf-card-rule" />
            <div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>
            <ArrowUpRight aria-hidden="true" />
          </article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف مجالات الممارسة الفعلية ووصفاً موجزاً يراجعه المكتب قبل النشر." : "Add the firm’s actual practice areas with concise descriptions reviewed before publication."}</OwnerPrompt>}
        </div>
      </section>;
      if (section.type === "qualifications" || section.type === "accreditation") {
        const items = itemsFor(section, language);
        const label = section.type === "qualifications"
          ? (ar ? "المؤهلات والخبرة المهنية" : "Professional profile & experience")
          : (ar ? "بيانات الترخيص والاعتماد" : "Licensing & accreditation");
        return <section key={section.id} {...props} className="lf-section lf-credentials">
          <div className="lf-credentials-heading">
            <span className="lf-kicker">{section.type === "qualifications" ? (ar ? "المسؤولية المهنية" : "PROFESSIONAL PROFILE") : (ar ? "بيانات معتمدة" : "VERIFIED DETAILS")}</span>
            <SectionHeading section={section} language={language} />
            <span className="lf-credentials-rule" />
          </div>
          <div className="lf-credentials-content">
            {items.length ? <div className="lf-experience-list">{items.map((item, i) => <article key={`${item.title}-${i}`} data-testid={`card-legal-credential-${i + 1}`}>
              <span className="lf-experience-mark"><Scale aria-hidden="true" /></span>
              <div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}{item.meta && <small>{item.meta}</small>}</div>
            </article>)}</div> : <OwnerPrompt kind="legal-profile">{ar
              ? `أضف ${label} بعد التحقق منها واعتمادها. لا تُعرض أسماء أو أرقام ترخيص أو سنوات خبرة افتراضية.`
              : `Add verified ${label} before publishing. Do not display invented names, license numbers, or years of experience.`}</OwnerPrompt>}
          </div>
        </section>;
      }
      if (section.type === "consultation") return <section key={section.id} {...props} className="lf-section lf-consultation">
        <div className="lf-consultation-heading">
          <span className="lf-kicker">{ar ? "الخطوة التالية" : "A CONVERSATION, NOT A FORM"}</span>
          <SectionHeading section={section} language={language} />
        </div>
        <div className="lf-consultation-body">
          {itemsFor(section, language).map((item, i) => item.description && <p key={`${item.title}-${i}`}>{item.description}</p>)}
          {!itemsFor(section, language).length && <p>{ar ? "أضف وصفاً معتمداً لآلية التواصل أو الاستفسار." : "Add an approved description of how prospective clients can make contact."}</p>}
          <a className="lf-consult-link" href={contactTarget} data-testid="link-legal-consult-contact">
            {ar ? "اطلع على خيارات التواصل" : "See contact options"}{ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </a>
          <p className="lf-note">{ar ? "لا تُرسل هذه المعاينة بيانات أو طلبات استشارة." : "This preview does not submit information or consultation requests."}</p>
        </div>
        <span className="lf-consultation-mark" aria-hidden="true"><MessageCircle /></span>
      </section>;
      if (section.type === "articles") return <section key={section.id} {...props} className="lf-section lf-articles">
        <SectionHeading section={section} language={language} kicker={ar ? "من مكتبة المكتب" : "INSIGHTS & NOTES"} />
        {itemsFor(section, language).length ? <div className="lf-article-list">
          {itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`} data-testid={`card-legal-article-${i + 1}`}>
            <span className="lf-article-icon"><BookOpen aria-hidden="true" /></span>
            <div><small>{ar ? "مادة تعريفية" : "INFORMATIONAL ARTICLE"} · {String(i + 1).padStart(2, "0")}</small><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div>
            <FileText aria-hidden="true" className="lf-article-endmark" />
          </article>)}
        </div> : <OwnerPrompt>{ar ? "أضف مقالات يراجعها مختص قبل النشر، مع عنوان ووصف واضحين." : "Add articles reviewed by a qualified professional before publication, with a clear title and summary."}</OwnerPrompt>}
        <DataNote language={language}>{ar ? "المعلومات المنشورة لا تُعد مشورة قانونية ولا تنشئ علاقة مهنية." : "Published information is not legal advice and does not establish a professional relationship."}</DataNote>
      </section>;
      if (section.type === "faq") return <section key={section.id} {...props} className="lf-section lf-faq">
        <div className="lf-faq-intro"><span className="lf-kicker">{ar ? "معلومات أساسية" : "BEFORE YOU GET IN TOUCH"}</span><SectionHeading section={section} language={language} /></div>
        {itemsFor(section, language).length ? <div className="lf-faq-list">
          {itemsFor(section, language).map((item, i) => <details key={`${item.title}-${i}`} data-testid={`item-legal-faq-${i + 1}`}>
            <summary><span className="lf-faq-number">{String(i + 1).padStart(2, "0")}</span><span>{item.title}</span><ChevronDown aria-hidden="true" /></summary>
            {item.description && <p>{item.description}</p>}
          </details>)}
        </div> : <OwnerPrompt>{ar ? "أضف أسئلة شائعة وإجابات راجعها المكتب، دون تقديم مشورة قانونية عامة." : "Add firm-reviewed FAQs and answers; avoid presenting general legal advice."}</OwnerPrompt>}
      </section>;
      if (section.type === "contact") return <section key={section.id} id="tp-contact" className="lf-contact" data-testid="section-preview-contact">
        <div className="lf-contact-heading"><span className="lf-kicker">{ar ? "تواصل مع المكتب" : "CONTACT THE FIRM"}</span><SectionHeading section={section} language={language} /></div>
        <div className="lf-contact-options">
          <p>{ar ? "اختر وسيلة التواصل المعتمدة للمكتب." : "Choose a confirmed way to reach the firm."}</p>
          <ContactActions customization={customization} language={language} variant="lf-contact-actions" />
        </div>
      </section>;
      return <section key={section.id} {...props} className="lf-section lf-other-section">
        <SectionHeading section={section} language={language} />
        {itemsFor(section, language).length
          ? <div className="lf-other-items">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`} data-testid={`card-legal-content-${section.type}-${i + 1}`}><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</article>)}</div>
          : <OwnerPrompt>{ar ? "أضف معلومات المكتب التي تمت مراجعتها واعتمادها." : "Add firm information that has been reviewed and approved."}</OwnerPrompt>}
      </section>;
    })}
    <footer className="lf-disclaimer" data-testid="text-legal-disclaimer">
      <span><Scale aria-hidden="true" />{text(customization.business.name, language, ar ? "اسم المكتب القانوني" : "Law firm name")}</span>
      <p>{ar ? "هذه المعاينة لا تقدم مشورة قانونية ولا تمثل مكتباً أو ترخيصاً حقيقياً." : "This preview does not provide legal advice or represent a real firm or license."}</p>
    </footer>
    <footer className="lf-site-footer">
      <a className="lf-footer-brand" href="#tp-top" data-testid="link-legal-footer-brand">
        {customization.brand.logo
          ? <img src={customization.brand.logo.src} alt={text(customization.brand.logo.alt, language, text(customization.business.name, language))} />
          : <span className="lf-footer-mark" aria-hidden="true"><Scale /></span>}
        <b>{text(customization.business.name, language, ar ? "اسم المكتب القانوني" : "Law firm name")}</b>
      </a>
      <span>{ar ? "معاينة قابلة للتخصيص — أضف البيانات المعتمدة قبل النشر." : "Editable preview — confirm all firm details before publishing."}</span>
      <a className="lf-back-top" href="#tp-top" data-testid="link-legal-back-to-top">{ar ? "للأعلى" : "Back to top"}<ArrowDown aria-hidden="true" /></a>
    </footer>
  </main>;
}
