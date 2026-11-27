import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, UtensilsCrossed } from "lucide-react";
import {
  ContactActions, ContactSection, DemoImage, HoursPlaceholder, OwnerPrompt,
  SectionHeading, SectionAttrs, itemsFor, sectionAnchor, sectionLabel, sectionTarget, text, type PreviewProps,
} from "./preview-shared";
import "./food-template.css";

function safeMapUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function localized(value: unknown, language: "ar" | "en") {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const entry = value as Record<string, unknown>;
    const selected = entry[language] ?? entry.en ?? entry.ar;
    return typeof selected === "string" ? selected.trim() : "";
  }
  return "";
}

function FoodHeroCopy({ section, language, customization, ctaHref, ctaLabel, ctaVisible }: {
  section: PreviewProps["sections"][number];
  language: PreviewProps["language"];
  customization: PreviewProps["customization"];
  ctaHref: string;
  ctaLabel: string;
  ctaVisible: boolean;
}) {
  const ar = language === "ar";
  const title = text(section.content.title, language, text(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name"));
  const tagline = text(section.content.tagline ?? customization.business.tagline, language, ar ? "أضف عبارة المكان المعتمدة." : "Add your approved hospitality message.");
  const description = text(section.content.description ?? customization.business.description, language, ar ? "أضف نبذة المكان المعتمدة هنا." : "Add your approved introduction here.");
  return <div className="tp-layout-hero-copy">
    <h1>{title}<em>{tagline}</em></h1>
    <p>{description}</p>
    {ctaVisible && <a className="tp-layout-cta" href={ctaHref} data-testid="link-food-hero-action">{ctaLabel}<ArrowUpRight aria-hidden="true" /></a>}
  </div>;
}

function socialLinksFor(sections: PreviewProps["sections"], language: PreviewProps["language"]) {
  const contact = sections.find((section) => section.type === "contact");
  const raw = contact?.content.socialLinks ?? contact?.content.socials;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const link = entry as Record<string, unknown>;
    const href = safeMapUrl(localized(link.url ?? link.href, language));
    const label = localized(link.label ?? link.platform ?? link.name, language);
    return href && label ? [{ href, label }] : [];
  });
}

function FoodNavigation({ sections, language }: Pick<PreviewProps, "sections" | "language">) {
  const ar = language === "ar";
  return <nav className="tp-layout-nav" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"} data-testid="nav-food-sections">
    {sections.filter((section) => section.type !== "hero").map((section) =>
      <a key={section.id} href={`#${sectionAnchor(section.type)}`} data-testid={`link-food-nav-${section.type}`}>{sectionLabel(section.type, language)}</a>)}
  </nav>;
}

export default function FoodLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("all");
  const menuVisible = sections.some((section) => section.type === "menu");
  const contactVisible = sections.some((section) => section.type === "contact");
  const menuTarget = sectionTarget(sections, "menu");
  const contactTarget = sectionTarget(sections, "contact");
  const galleryImages = customization.images.gallery;
  const menuSection = sections.find((section) => section.type === "menu");
  const menuItems = useMemo(() => menuSection ? itemsFor(menuSection, language) : [], [menuSection, language]);
  const rawMenuItems = menuSection?.content.items ?? menuSection?.content.entries ?? menuSection?.content.cards;
  const menuDetails = Array.isArray(rawMenuItems) ? rawMenuItems.map((item) => item && typeof item === "object" ? item as Record<string, unknown> : {}) : [];
  const categories = useMemo(() => {
    const known = new Map<string, string>();
    menuDetails.forEach((item) => {
      const category = item.category;
      const key = localized(category, "en") || localized(category, "ar");
      const label = localized(category, language);
      if (key && label && !known.has(key)) known.set(key, label);
    });
    return [...known].map(([key, label]) => ({ key, label }));
  }, [menuSection, language]);
  const visibleItems = menuItems.map((item, index) => ({
    ...item,
    category: localized(menuDetails[index]?.category, language),
    categoryKey: localized(menuDetails[index]?.category, "en") || localized(menuDetails[index]?.category, "ar"),
    featured: menuDetails[index]?.featured === true,
    offer: localized(menuDetails[index]?.offer, language),
    originalIndex: index,
  }))
    .filter((item) => activeCategoryKey === "all" || item.categoryKey === activeCategoryKey);
  const sampleImages = new Set([
    "/images/restaurants-hero.jpg",
    "/images/restaurants-menu-meal.jpg",
    "/images/restaurants-menu-coffee.jpg",
    "/images/restaurants-menu-juice.jpg",
    "/images/restaurants-atmosphere.jpg",
  ]);
  const isSampleImage = (src: string) => sampleImages.has(src);
  const demoLabel = ar ? "صور وأصناف نموذجية قابلة للاستبدال" : "Replaceable sample imagery & menu";
  const hasSampleMenu = menuItems.some((item) => /sample|replaceable|مثال|قابل للاستبدال|قابلة للاستبدال/i.test(`${item.title} ${item.description}`));
  const socials = socialLinksFor(sections, language);
  const hasContactDetails = !!(customization.business.phone || customization.business.whatsapp || customization.business.email || customization.business.address || customization.business.appointmentUrl);
  return <main style={styles} className="tp-root tp-layout tp-layout-food" data-template-layout="restaurants-cafes-juice" data-testid="template-preview-restaurants-cafes-juice" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "مائدة بطابعها الخاص" : "A TABLE WITH CHARACTER"}</span><span>{template.name[language]}</span></div>
    <header className="tp-food-header">
      <a href="#tp-top" className="tp-food-brand">
        {customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <span className="tp-food-brand-mark"><UtensilsCrossed /></span>}
        <span>{customization.business.name[language]}</span>
      </a>
      <FoodNavigation sections={sections} language={language} />
      {(menuVisible || contactVisible) && <a href={menuVisible ? menuTarget : contactTarget} className="tp-food-menu-link" data-testid="link-food-header-action">
        {menuVisible ? (ar ? "إلى القائمة" : "The menu") : (ar ? "تواصل معنا" : "Get in touch")}<ArrowUpRight />
      </a>}
    </header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-food-hero" data-testid={`section-preview-hero-${index}`}>
        <div className="tp-food-hero-copy">
          <span className="tp-layout-kicker tp-food-kicker">{ar ? "من مطبخنا إلى مائدتكم" : "GOOD THINGS, MADE HERE"}</span>
          <FoodHeroCopy
            section={section}
            language={language}
            customization={customization}
            ctaHref={menuVisible ? menuTarget : contactTarget}
            ctaLabel={menuVisible ? (ar ? "تصفّح القائمة" : "Find your next favorite") : (ar ? "تواصل معنا" : "Come say hello")}
            ctaVisible={menuVisible || contactVisible}
          />
          {contactVisible && <a className="tp-food-visit-link" href={contactTarget}>{ar ? "الزيارة والتواصل" : "Visit & contact"}<ArrowUpRight /></a>}
        </div>
        <div className="tp-food-cover">
          <DemoImage customization={customization} language={language} variant="food" />
          {customization.images.hero && isSampleImage(customization.images.hero.src) && <span className="tp-food-image-note">{demoLabel}</span>}
          <div className="tp-food-stamp"><span>{ar ? "طازج كل يوم" : "MADE FOR THE MOMENT"}</span></div>
        </div>
        <div className="tp-food-hero-foot"><span>{ar ? "النكهة · المكان · الناس" : "FLAVOUR · PLACE · PEOPLE"}</span>{menuVisible && <a href={menuTarget}>{ar ? "اكتشف القائمة" : "DISCOVER THE MENU"}<ArrowUpRight /></a>}</div>
      </section>;

      const props = SectionAttrs({ section, index, className: "tp-food-section" });
      if (section.type === "menu") return <section key={section.id} {...props} id="tp-section-menu">
        <div className="tp-food-menu-heading">
          <div><span className="tp-layout-kicker">{ar ? "يُحضّر هنا، ويُقدّم بحب" : "A LITTLE OF WHAT WE LOVE"}</span><SectionHeading section={section} language={language} /></div>
          <span className="tp-food-menu-aside">{ar ? "قائمة المكان" : "THE HOUSE MENU"}<i /></span>
        </div>
        <div className="tp-food-filter-row" role="group" aria-label={ar ? "تصفية أصناف القائمة" : "Filter menu categories"}>
          <button type="button" className={activeCategoryKey === "all" ? "is-active" : ""} onClick={() => setActiveCategoryKey("all")} aria-pressed={activeCategoryKey === "all"} data-testid="button-food-category-all">{ar ? "الكل" : "Everything"}</button>
          {categories.map((category, i) => <button type="button" key={category.key} className={activeCategoryKey === category.key ? "is-active" : ""} onClick={() => setActiveCategoryKey(category.key)} aria-pressed={activeCategoryKey === category.key} data-testid={`button-food-category-${i + 1}`}>{category.label}</button>)}
        </div>
        {visibleItems.length ? <div className="tp-food-menu-grid">
          {visibleItems.map((item, i) => {
            const originalIndex = item.originalIndex;
            const image = galleryImages.length ? galleryImages[originalIndex % galleryImages.length] : undefined;
            const isFeatured = item.featured;
            return <article key={`${item.title}-${i}`} className={`tp-food-menu-card${isFeatured ? " is-featured" : ""}`} data-testid={`card-food-menu-${originalIndex + 1}`}>
              <div className="tp-food-menu-photo">
                {image ? <img src={image.src} alt={image.alt[language]} loading="lazy" /> : <DemoImage customization={customization} language={language} variant="food" index={0} />}
                {image && isSampleImage(image.src) && <span className="tp-food-image-note">{ar ? "صورة نموذجية قابلة للاستبدال" : "REPLACEABLE SAMPLE PHOTO"}</span>}
                {isFeatured && <span className="tp-food-featured">{hasSampleMenu
                  ? (ar ? "صنف نموذجي مميز" : "FEATURED SAMPLE")
                  : (ar ? "صنف مميز" : "FEATURED ITEM")}</span>}
                {item.offer && <span className="tp-food-offer" data-testid={`badge-food-offer-${originalIndex + 1}`}>{item.offer}</span>}
                <span className="tp-food-menu-ordinal">0{originalIndex + 1}</span>
              </div>
              <div className="tp-food-menu-card-copy">
                {item.category && <span className="tp-food-card-category">{item.category}</span>}
                <div className="tp-food-title-price"><h3>{item.title}</h3>{item.meta && <span className="tp-menu-price">{item.meta}</span>}</div>
                <p>{item.description}</p>
              </div>
            </article>;
          })}
        </div> : <OwnerPrompt>{ar ? "أضف أصناف القائمة المعتمدة من المكان." : "Add menu items confirmed by the venue."}</OwnerPrompt>}
        <p className="tp-menu-disclaimer">{hasSampleMenu
          ? (ar ? "أصناف المعاينة أمثلة قابلة للاستبدال. أضف الأسعار المعتمدة فقط." : "Menu items shown are replaceable samples. Add verified prices only.")
          : (ar ? "تُعرض الأسعار كما أُدخلت؛ تحقق من التفاصيل قبل النشر." : "Prices display as entered; confirm all menu details before publishing.")}</p>
        {contactVisible && <a className="tp-food-order-anchor" href={contactTarget}>{ar ? "استفسر عن الطلب أو الحجز" : "Ask about an order or reservation"}<ArrowUpRight /></a>}
      </section>;

      if (section.type === "story") return <section key={section.id} {...props} className="tp-food-story">
        <div className="tp-food-story-art">
          {galleryImages[3] && <img src={galleryImages[3].src} alt={galleryImages[3].alt[language]} loading="lazy" />}
          {galleryImages[3] && isSampleImage(galleryImages[3].src) && <small className="tp-food-image-note">{ar ? "صورة نموذجية قابلة للاستبدال" : "REPLACEABLE SAMPLE IMAGE"}</small>}
          <span>{ar ? "حكاية المكان" : "A PLACE TO LINGER"}</span>
        </div>
        <div className="tp-food-story-content"><span className="tp-layout-kicker">{ar ? "حكاية من المطبخ" : "A NOTE FROM THE HOUSE"}</span>
          <SectionHeading section={section} language={language} />
          <div className="tp-food-story-copy">{itemsFor(section, language).map((item, i) => <p key={i}>{item.description || item.title}</p>)}
            {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف قصة المكان بكلماتك." : "Tell the story of your place in your own words."}</OwnerPrompt>}
          </div>
        </div>
      </section>;

      if (section.type === "gallery") return <section key={section.id} {...props}>
        <div className="tp-food-gallery-head"><SectionHeading section={section} language={language} kicker={ar ? "تفاصيل من المكان" : "A FEEL FOR THE PLACE"} /><span>{ar ? "مساحة للقاء، وللبقاء قليلاً." : "Come for a bite. Stay for a while."}</span></div>
        {galleryImages.length
          ? <div className="tp-food-gallery">{galleryImages.slice(0, 6).map((image, i) => <figure key={`${image.src}-${i}`} className={`tp-food-gallery-item item-${i + 1}`}><img src={image.src} alt={image.alt[language]} loading="lazy" /><figcaption>{image.alt[language]}{isSampleImage(image.src) && <small>{ar ? "صورة نموذجية قابلة للاستبدال" : "Replaceable sample image"}</small>}</figcaption></figure>)}</div>
          : <div className="tp-food-gallery-empty"><DemoImage customization={customization} language={language} variant="food" index={1} /><OwnerPrompt>{ar ? "أضف صوراً أصلية للأطباق أو المكان." : "Add original images of your food or space."}</OwnerPrompt></div>}
      </section>;

      if (section.type === "opening-hours") return <section key={section.id} {...props} className="tp-food-hours">
        <div><span className="tp-layout-kicker">{ar ? "حين تفتح الأبواب" : "WHEN THE DOORS ARE OPEN"}</span><SectionHeading section={section} language={language} /></div>
        {itemsFor(section, language).length
          ? <div className="tp-hours-schedule">{itemsFor(section, language).map((item, i) => <div key={`${item.title}-${i}`}><strong>{item.title}</strong><span>{item.description}</span></div>)}</div>
          : <HoursPlaceholder language={language} />}
      </section>;

      if (section.type === "locations") {
        const rawItems = section.content.items ?? section.content.entries ?? section.content.cards;
        return <section key={section.id} {...props} className="tp-food-locations">
          <div><span className="tp-layout-kicker">{ar ? "اعثر على مائدتنا" : "FIND YOUR WAY HERE"}</span><SectionHeading section={section} language={language} /></div>
        {itemsFor(section, language).length
          ? <div className="tp-branch-list">{itemsFor(section, language).map((item, i) => {
              const raw = Array.isArray(rawItems) ? rawItems[i] as Record<string, unknown> | undefined : undefined;
              const mapUrl = safeMapUrl(localized(raw?.mapUrl ?? raw?.url ?? raw?.map, language));
              return <article key={`${item.title}-${i}`}><MapPin /><div><strong>{item.title}</strong><p>{item.description}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">{ar ? "افتح الموقع" : "Open map"}<ArrowUpRight /></a>}</div></article>;
            })}</div>
            : customization.business.address
            ? <div className="tp-location-address"><MapPin /><span>{customization.business.address[language]}</span></div>
            : <OwnerPrompt>{ar ? "أضف عنواناً أو رابط موقع الفرع بعد تأكيده." : "Add a confirmed branch address or map link."}</OwnerPrompt>}
        </section>;
      }

      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="food" />;
      return null;
    })}
    <div className="tp-food-bottomline"><span>{ar ? "نرحّب بكم على المائدة" : "There’s always room at the table."}</span><a href="#tp-top">{ar ? "للأعلى" : "Back to top"}<ArrowUpRight /></a></div>
    <footer className="tp-food-footer">
      <div className="tp-food-footer-main">
        <div className="tp-food-footer-brand">
          <a href="#tp-top">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <UtensilsCrossed aria-hidden="true" />}<strong>{customization.business.name[language]}</strong></a>
          <p>{text(customization.business.tagline, language, ar ? "أضف عبارة المكان المعتمدة." : "Add your confirmed hospitality message.")}</p>
        </div>
        {hasContactDetails && <ContactActions customization={customization} language={language} variant="tp-food-footer-actions" />}
        {socials.length > 0 && <nav className="tp-food-social-links" aria-label={ar ? "روابط التواصل الاجتماعي" : "Social links"}>
          <span>{ar ? "تابعوا المكان" : "FOLLOW ALONG"}</span>
          {socials.map((social, i) => <a key={`${social.href}-${i}`} href={social.href} target="_blank" rel="noopener noreferrer" data-testid={`link-food-social-${i + 1}`}>{social.label}<ArrowUpRight aria-hidden="true" /></a>)}
        </nav>}
      </div>
      <div className="tp-food-footer-base"><span>{ar ? "معاينة قابلة للتخصيص — أضف بياناتك المعتمدة قبل النشر." : "Editable preview — add confirmed business details before publishing."}</span><a href="#tp-top">{ar ? "للأعلى" : "Back to top"}<ArrowUpRight aria-hidden="true" /></a></div>
    </footer>
  </main>;
}
