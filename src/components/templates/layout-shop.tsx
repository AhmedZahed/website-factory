import { ArrowRight, ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import {
  ContactSection, DemoImage, HeroCopy, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, text, type PreviewProps,
} from "./preview-shared";

export default function ShopLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const catalogVisible = sections.some((section) => section.type === "catalog");
  const catalogTarget = sectionTarget(sections, "catalog");
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-shop" data-template-layout="shops-personal-services" data-testid="template-preview-shops-personal-services" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "تصفّح محلي" : "BROWSE LOCAL"}</span><span>{template.name[language]}</span></div>
    <header className="tp-shop-header"><a href="#tp-top" className="tp-shop-brand">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <Sparkles />}{customization.business.name[language]}</a><SectionNav sections={sections} language={language} /><a href={catalogVisible ? catalogTarget : contactTarget} className="tp-shop-bag"><ShoppingBag />{catalogVisible ? (ar ? "تصفّح المجموعة" : "Browse collection") : (ar ? "تواصل معنا" : "Get in touch")}</a></header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-shop-hero">
        <div className="tp-shop-copy"><span className="tp-shop-edition">{ar ? "اختيارات محلية" : "THE LOCAL EDIT"}</span><HeroCopy section={section} language={language} customization={customization} ctaHref={catalogVisible ? catalogTarget : contactTarget} ctaLabel={catalogVisible ? (ar ? "اكتشف المجموعة" : "Browse collection") : (ar ? "تواصل معنا" : "Get in touch")} />
          <a className="tp-shop-collection-link" href={catalogVisible ? catalogTarget : contactTarget}>{catalogVisible ? (ar ? "اكتشف المنتجات والخدمات" : "Discover products & services") : (ar ? "خيارات التواصل" : "Contact options")}<ArrowRight /></a></div>
        <div className="tp-shop-editorial-image"><DemoImage customization={customization} language={language} variant="retail" /><span className="tp-shop-image-caption">{ar ? "اختيرت لك" : "A closer look"}</span></div>
        <div className="tp-shop-hero-label">SHOP / CARE / DISCOVER</div>
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-shop-section" });
      if (section.type === "catalog") return <section key={section.id} {...props} id="tp-catalog">
        {text(section.content.promotion, language) ? <aside className="tp-shop-promo">{text(section.content.promotion, language)}</aside>
          : <aside className="tp-shop-promo"><OwnerPrompt kind="promotion">{ar ? "أضف عرضاً ترويجياً معتمداً أو اترك هذا الموضع مخفياً." : "Add a confirmed promotion, or hide this slot if there is no current offer."}</OwnerPrompt></aside>}
        <div className="tp-shop-section-head"><div><span className="tp-layout-kicker">{ar ? "تصفّح حسب اختيارك" : "BROWSE THE EDIT"}</span><SectionHeading section={section} language={language} /></div>
          <span className="tp-shop-count">{String(itemsFor(section, language).length).padStart(2, "0")} / PICKS</span></div>
        {itemsFor(section, language).length > 0 && <nav className="tp-shop-browse-index" aria-label={ar ? "تصفح المنتجات" : "Browse products"}>
          {itemsFor(section, language).map((item, i) => <a key={`${item.title}-${i}`} href={`#tp-product-${i}`}>{item.title}<span>↗</span></a>)}
        </nav>}
        <div className="tp-product-grid">{itemsFor(section, language).map((item, i) => <article className="tp-product-tile" id={`tp-product-${i}`} key={`${item.title}-${i}`}>
          <DemoImage customization={customization} language={language} variant="retail" index={i + 1} />
          <span className="tp-product-category">{ar ? `اختيار ${String(i + 1).padStart(2, "0")}` : `COLLECTION / 0${i + 1}`}</span>
          <h3>{item.title}</h3><p>{item.description}</p>
          <a href={contactTarget}>{ar ? "استفسر عن التوفر" : "Ask about availability"}<ArrowUpRight /></a>
        </article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف منتجات أو مجموعات متاحة للتصفح." : "Add products or collections that are available to browse."}</OwnerPrompt>}
        </div>
      </section>;
      if (section.type === "featured-services" || section.type === "services") return <section key={section.id} {...props} className="tp-shop-services">
        <div className="tp-shop-service-title"><span className="tp-layout-kicker">{ar ? "لمسة شخصية" : "PERSONAL SERVICE"}</span><SectionHeading section={section} language={language} /></div>
        <div className="tp-shop-service-list">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><a href={contactTarget} aria-label={ar ? "استفسر عن الخدمة" : "Ask about this service"}><ArrowUpRight /></a></article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف الخدمات الشخصية أو خيارات الحجز المتاحة." : "Add personal services or available booking options."}</OwnerPrompt>}
        </div>
      </section>;
      if (section.type === "gallery") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "من تفاصيلنا" : "A FEW DETAILS"} />
        {customization.images.gallery.length
          ? <div className="tp-shop-gallery">{customization.images.gallery.slice(0, 6).map((image, i) => <img key={`${image.src}-${i}`} src={image.src} alt={image.alt[language]} loading="lazy" />)}</div>
          : <div className="tp-shop-gallery-empty"><DemoImage customization={customization} language={language} variant="retail" index={1} /><OwnerPrompt>{ar ? "أضف صور المنتجات أو المساحة." : "Add product or space imagery."}</OwnerPrompt></div>}
      </section>;
      if (section.type === "testimonials") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><OwnerPrompt kind="proof">{ar ? "أضف مراجعات حقيقية بموافقة أصحابها." : "Add genuine reviews with permission from their authors."}</OwnerPrompt></section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="shop" />;
      if (section.type === "faq") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-shop-faq">{itemsFor(section, language).map((item, i) => <details key={i}><summary>{item.title}</summary><p>{item.description}</p></details>)}</div></section>;
      if (section.type === "team") return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><div className="tp-shop-team">{itemsFor(section, language).map((item, i) => <article key={i}><strong>{item.title}</strong><p>{item.description}</p></article>)}</div></section>;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><OwnerPrompt>{ar ? "أضف تفاصيل هذه المجموعة." : "Add details for this collection."}</OwnerPrompt></section>;
    })}
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
