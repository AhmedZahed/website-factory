import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Menu as MenuIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  ContactActions,
  DemoImage,
  HoursPlaceholder,
  OwnerPrompt,
  SectionAttrs,
  SectionHeading,
  itemsFor,
  sectionAnchor,
  sectionLabel,
  sectionTarget,
  text,
  type PreviewProps,
} from "./preview-shared";
import "./food-template.css";

type FoodContentRow = {
  title: string;
  description: string;
  meta: string;
  originalIndex: number;
  raw: Record<string, unknown>;
};

function contentRows(
  section: PreviewProps["sections"][number] | undefined,
  language: PreviewProps["language"],
): FoodContentRow[] {
  const source = section?.content.items ?? section?.content.entries ?? section?.content.cards;
  if (!Array.isArray(source)) return [];
  return source.flatMap((entry, originalIndex) => {
    if (!entry || typeof entry !== "object") return [];
    const raw = entry as Record<string, unknown>;
    const title = text(raw.title, language);
    const description = text(raw.description, language);
    if (!title && !description) return [];
    return [{
      title: title || (language === "ar" ? "تفاصيل إضافية" : "More details"),
      description,
      meta: text(raw.meta, language),
      originalIndex,
      raw,
    }];
  });
}

function safeExternalUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function socialLinksFor(
  sections: PreviewProps["sections"],
  language: PreviewProps["language"],
) {
  const contact = sections.find((section) => section.type === "contact");
  const raw = contact?.content.socialLinks ?? contact?.content.socials;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const link = entry as Record<string, unknown>;
    const href = safeExternalUrl(text(link.url ?? link.href, language));
    const label = text(link.label ?? link.platform ?? link.name, language);
    return href && label ? [{ href, label }] : [];
  });
}

function FoodHeroCopy({
  section,
  language,
  customization,
  ctaHref,
  ctaLabel,
  ctaVisible,
}: {
  section: PreviewProps["sections"][number];
  language: PreviewProps["language"];
  customization: PreviewProps["customization"];
  ctaHref: string;
  ctaLabel: string;
  ctaVisible: boolean;
}) {
  const ar = language === "ar";
  const title = text(
    section.content.title,
    language,
    text(customization.business.name, language, ar ? "اسم النشاط التجاري" : "Business name"),
  );
  const tagline = text(
    section.content.tagline ?? customization.business.tagline,
    language,
    ar ? "أضف عبارة المكان المعتمدة." : "Add your approved hospitality message.",
  );
  const description = text(
    section.content.description ?? customization.business.description,
    language,
    ar ? "أضف نبذة المكان المعتمدة هنا." : "Add your approved introduction here.",
  );
  return <div className="tp-layout-hero-copy">
    <h1>{title}<em>{tagline}</em></h1>
    <p>{description}</p>
    {ctaVisible && <a className="tp-layout-cta" href={ctaHref} data-testid="link-food-hero-action">
      {ctaLabel}<ArrowDown aria-hidden="true" />
    </a>}
  </div>;
}

function FoodNavigation({
  sections,
  language,
  open,
  onSelect,
}: Pick<PreviewProps, "sections" | "language"> & { open: boolean; onSelect: () => void }) {
  const ar = language === "ar";
  return <nav
    className={`tp-food-nav${open ? " is-open" : ""}`}
    aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}
    data-testid="nav-food-sections"
  >
    {sections.filter((section) => section.type !== "hero").map((section) =>
      <a
        key={section.id}
        href={`#${sectionAnchor(section.type)}`}
        onClick={onSelect}
        data-testid={`link-food-nav-${section.type}`}
      >
        {sectionLabel(section.type, language)}
      </a>)}
  </nav>;
}

export default function FoodLayout({
  template,
  language,
  customization,
  sections,
  styles,
}: PreviewProps) {
  const ar = language === "ar";
  const [activeCategoryKey, setActiveCategoryKey] = useState("all");
  const [navOpen, setNavOpen] = useState(false);
  const menuSection = sections.find((section) => section.type === "menu");
  const menuItems = useMemo(
    () => contentRows(menuSection, language).map((row) => {
      const categoryKey = text(row.raw.category, "en") || text(row.raw.category, "ar");
      return {
        ...row,
        category: text(row.raw.category, language),
        categoryKey,
        featured: row.raw.featured === true,
        offer: text(row.raw.offer, language),
      };
    }),
    [menuSection, language],
  );
  const categories = useMemo(() => {
    const known = new Map<string, string>();
    menuItems.forEach((item) => {
      if (item.categoryKey && item.category && !known.has(item.categoryKey)) {
        known.set(item.categoryKey, item.category);
      }
    });
    return [...known].map(([key, label]) => ({ key, label }));
  }, [menuItems]);
  useEffect(() => {
    if (activeCategoryKey !== "all" && !categories.some((category) => category.key === activeCategoryKey)) {
      setActiveCategoryKey("all");
    }
  }, [activeCategoryKey, categories]);

  const menuVisible = sections.some((section) => section.type === "menu");
  const contactSection = sections.find((section) => section.type === "contact");
  const contactVisible = !!contactSection;
  const menuTarget = sectionTarget(sections, "menu");
  const contactTarget = sectionTarget(sections, "contact");
  const hasContactDetails = !!(
    customization.business.phone
    || customization.business.whatsapp
    || customization.business.email
    || customization.business.address
    || customization.business.appointmentUrl
  );
  const hasOrderContact = !!(
    customization.business.phone
    || customization.business.whatsapp
    || customization.business.email
    || customization.business.appointmentUrl
  );
  const galleryImages = customization.images.gallery;
  const sampleImages = new Set([
    "/images/restaurants-hero.jpg",
    "/images/restaurants-menu-meal.jpg",
    "/images/restaurants-menu-coffee.jpg",
    "/images/restaurants-menu-juice.jpg",
    "/images/restaurants-atmosphere.jpg",
  ]);
  const isSampleImage = (src: string) => sampleImages.has(src);
  const demoLabel = ar ? "صور وأصناف نموذجية قابلة للاستبدال" : "Replaceable sample imagery & menu";
  const hasSampleMenu = menuItems.some((item) =>
    /sample|replaceable|مثال|قابل للاستبدال|قابلة للاستبدال/i.test(`${item.title} ${item.description}`),
  );
  const socials = socialLinksFor(sections, language);
  const visibleItems = menuItems.filter((item) =>
    activeCategoryKey === "all" || item.categoryKey === activeCategoryKey,
  );
  const mobileNavAvailable = sections.some((section) => section.type !== "hero");

  return <main
    style={styles}
    className="tp-root tp-layout tp-layout-food"
    data-template-layout="restaurants-cafes-juice"
    data-testid="template-preview-restaurants-cafes-juice"
    dir={ar ? "rtl" : "ltr"}
    lang={language}
    id="tp-top"
  >
    <div className="tp-food-topline">
      <span>{ar ? "مائدة بطابعها الخاص" : "A table with character"}</span>
      <span>{template.name[language]}</span>
    </div>
    <header className="tp-food-header">
      <a href="#tp-top" className="tp-food-brand" data-testid="link-food-brand">
        {customization.brand.logo
          ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} />
          : <span className="tp-food-brand-mark" aria-hidden="true"><UtensilsCrossed /></span>}
        <span>{customization.business.name[language]}</span>
      </a>
      <FoodNavigation
        sections={sections}
        language={language}
        open={navOpen}
        onSelect={() => setNavOpen(false)}
      />
      <div className="tp-food-header-actions">
        {(menuVisible || (contactVisible && hasOrderContact)) && <a
          href={menuVisible ? menuTarget : contactTarget}
          className="tp-food-header-cta"
          data-testid="link-food-header-action"
        >
          {menuVisible ? (ar ? "القائمة" : "The menu") : (ar ? "تواصل" : "Get in touch")}
          <ArrowUpRight aria-hidden="true" />
        </a>}
        {mobileNavAvailable && <button
          type="button"
          className="tp-food-mobile-toggle"
          onClick={() => setNavOpen((open) => !open)}
          aria-expanded={navOpen}
          aria-label={navOpen ? (ar ? "إغلاق القائمة" : "Close menu") : (ar ? "فتح القائمة" : "Open menu")}
          data-testid="button-food-mobile-nav"
        >
          {navOpen ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>}
      </div>
    </header>

    {sections.map((section, index) => {
      if (section.type === "hero") return <section
        key={section.id}
        className="tp-food-hero"
        data-testid={`section-preview-hero-${index}`}
        id="tp-section-hero"
      >
        <div className="tp-food-hero-copy">
          <span className="tp-food-eyebrow">{ar ? "من مطبخنا إلى مائدتكم" : "Good things, made here"}</span>
          <FoodHeroCopy
            section={section}
            language={language}
            customization={customization}
            ctaHref={menuVisible ? menuTarget : contactTarget}
            ctaLabel={menuVisible ? (ar ? "اكتشف القائمة" : "Explore the menu") : (ar ? "تواصل معنا" : "Get in touch")}
            ctaVisible={menuVisible || (contactVisible && hasOrderContact)}
          />
          {contactVisible && hasOrderContact && <a className="tp-food-hero-contact" href={contactTarget} data-testid="link-food-hero-contact">
            {ar ? "الطلب أو الحجز" : "Orders & reservations"}<ArrowUpRight aria-hidden="true" />
          </a>}
        </div>
        <div className="tp-food-hero-media">
          <DemoImage customization={customization} language={language} variant="food" />
          {customization.images.hero && isSampleImage(customization.images.hero.src) && <span className="tp-food-image-caption">{demoLabel}</span>}
          <span className="tp-food-hero-index">{ar ? "نكهة · مكان · ناس" : "FLAVOUR · PLACE · PEOPLE"}</span>
        </div>
        <div className="tp-food-hero-foot">
          <span>{ar ? "النكهة · المكان · الناس" : "Flavour · Place · People"}</span>
          {menuVisible && <a href={menuTarget}>{ar ? "إلى القائمة" : "DISCOVER THE MENU"}<ArrowUpRight aria-hidden="true" /></a>}
        </div>
      </section>;

      const sectionProps = SectionAttrs({ section, index, className: "tp-food-section" });
      if (section.type === "menu") return <section key={section.id} {...sectionProps} id="tp-section-menu">
        <div className="tp-food-menu-heading">
          <div>
            <span className="tp-food-eyebrow">{ar ? "يُحضّر هنا، ويُقدّم بحب" : "A little of what we love"}</span>
            <SectionHeading section={section} language={language} />
          </div>
          <span className="tp-food-menu-aside">{ar ? "قائمة المكان" : "THE HOUSE MENU"}<i /></span>
        </div>
        <div className="tp-food-filter-row" role="group" aria-label={ar ? "تصفية أصناف القائمة" : "Filter menu categories"}>
          <button
            type="button"
            className={activeCategoryKey === "all" ? "is-active" : ""}
            onClick={() => setActiveCategoryKey("all")}
            aria-pressed={activeCategoryKey === "all"}
            data-testid="button-food-category-all"
          >{ar ? "الكل" : "Everything"}</button>
          {categories.map((category, categoryIndex) => <button
            type="button"
            key={category.key}
            className={activeCategoryKey === category.key ? "is-active" : ""}
            onClick={() => setActiveCategoryKey(category.key)}
            aria-pressed={activeCategoryKey === category.key}
            data-testid={`button-food-category-${categoryIndex + 1}`}
          >{category.label}</button>)}
        </div>
        {visibleItems.length
          ? <div className="tp-food-menu-grid" aria-live="polite">
            {visibleItems.map((item) => {
              const image = galleryImages.length
                ? galleryImages[item.originalIndex % galleryImages.length]
                : undefined;
              return <article
                key={`${item.title}-${item.originalIndex}`}
                className={`tp-food-menu-card${item.featured ? " is-featured" : ""}`}
                data-testid={`card-food-menu-${item.originalIndex + 1}`}
              >
                <div className="tp-food-menu-photo">
                  {image
                    ? <img src={image.src} alt={image.alt[language]} loading="lazy" />
                    : <DemoImage customization={customization} language={language} variant="food" index={1} />}
                  {image && isSampleImage(image.src) && <span className="tp-food-image-caption">{ar ? "صورة نموذجية قابلة للاستبدال" : "REPLACEABLE SAMPLE PHOTO"}</span>}
                  {item.featured && <span className="tp-food-featured">{hasSampleMenu
                    ? (ar ? "صنف نموذجي مميز" : "FEATURED SAMPLE")
                    : (ar ? "صنف مميز" : "FEATURED ITEM")}</span>}
                  {item.offer && <span className="tp-food-offer" data-testid={`badge-food-offer-${item.originalIndex + 1}`}>{item.offer}</span>}
                  <span className="tp-food-menu-ordinal">0{item.originalIndex + 1}</span>
                </div>
                <div className="tp-food-menu-card-copy">
                  {item.category && <span className="tp-food-card-category">{item.category}</span>}
                  <div className="tp-food-title-price">
                    <h3>{item.title}</h3>
                    {item.meta && <span className="tp-menu-price" data-testid={`text-food-price-${item.originalIndex + 1}`}>{item.meta}</span>}
                  </div>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>;
            })}
          </div>
          : <OwnerPrompt>{ar ? "أضف أصناف القائمة المعتمدة من المكان." : "Add menu items confirmed by the venue."}</OwnerPrompt>}
        {hasSampleMenu && <p className="tp-menu-disclaimer">{ar
          ? "أصناف المعاينة أمثلة قابلة للاستبدال. أضف الأسعار المعتمدة فقط."
          : "Menu items shown are replaceable samples. Add verified prices only."}</p>}
        {hasOrderContact && <a className="tp-food-order-link" href={contactTarget} data-testid="link-food-order-contact">
          {ar ? "استفسر عن الطلب أو الحجز" : "Ask about an order or reservation"}<ArrowUpRight aria-hidden="true" />
        </a>}
      </section>;

      if (section.type === "story") {
        const storyImage = galleryImages[3] ?? galleryImages[0];
        return <section key={section.id} {...sectionProps} className="tp-food-story">
          <div className="tp-food-story-media">
            {storyImage
              ? <img src={storyImage.src} alt={storyImage.alt[language]} loading="lazy" />
              : <DemoImage customization={customization} language={language} variant="food" index={1} />}
            {storyImage && isSampleImage(storyImage.src) && <span className="tp-food-image-caption">{ar ? "صورة نموذجية قابلة للاستبدال" : "REPLACEABLE SAMPLE IMAGE"}</span>}
          </div>
          <div className="tp-food-story-copy">
            <span className="tp-food-eyebrow">{ar ? "حكاية من المطبخ" : "A note from the house"}</span>
            <SectionHeading section={section} language={language} />
            <div className="tp-food-story-text">
              {itemsFor(section, language).map((item, itemIndex) => <p key={`${item.title}-${itemIndex}`}>{item.description || item.title}</p>)}
              {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف قصة المكان بكلماتك." : "Tell the story of your place in your own words."}</OwnerPrompt>}
            </div>
          </div>
        </section>;
      }

      if (section.type === "gallery") return <section key={section.id} {...sectionProps} className="tp-food-gallery-section">
        <div className="tp-food-gallery-head">
          <SectionHeading section={section} language={language} kicker={ar ? "تفاصيل من المكان" : "A feel for the place"} />
          <span>{ar ? "صور أصلية من المكان والأطباق." : "A closer look at the dishes and the place."}</span>
        </div>
        {galleryImages.length
          ? <div className="tp-food-gallery">
            {galleryImages.slice(0, 6).map((image, imageIndex) => <figure key={`${image.src}-${imageIndex}`} className={`tp-food-gallery-item item-${imageIndex + 1}`} data-testid={`figure-food-gallery-${imageIndex + 1}`}>
              <img src={image.src} alt={image.alt[language]} loading="lazy" />
              <figcaption>{image.alt[language]}{isSampleImage(image.src) && <small>{ar ? "صورة نموذجية قابلة للاستبدال" : "Replaceable sample image"}</small>}</figcaption>
            </figure>)}
          </div>
          : <div className="tp-food-gallery-empty"><DemoImage customization={customization} language={language} variant="food" index={1} /><OwnerPrompt>{ar ? "أضف صوراً أصلية للأطباق أو المكان." : "Add original images of your food or space."}</OwnerPrompt></div>}
      </section>;

      if (section.type === "opening-hours") {
        const schedule = contentRows(section, language);
        return <section key={section.id} {...sectionProps} className="tp-food-hours">
          <div><span className="tp-food-eyebrow">{ar ? "حين تفتح الأبواب" : "Before you visit"}</span><SectionHeading section={section} language={language} /></div>
          {schedule.length
            ? <div className="tp-food-schedule">{schedule.map((item) => <div key={`${item.title}-${item.originalIndex}`} data-testid={`row-food-hours-${item.originalIndex + 1}`}><strong>{item.title}</strong><span>{item.description}</span></div>)}</div>
            : <HoursPlaceholder language={language} />}
        </section>;
      }

      if (section.type === "locations") {
        const locations = contentRows(section, language);
        return <section key={section.id} {...sectionProps} className="tp-food-locations">
          <div><span className="tp-food-eyebrow">{ar ? "اعثر على مائدتنا" : "Find your way here"}</span><SectionHeading section={section} language={language} /></div>
          {locations.length
            ? <div className="tp-food-location-list">
              {locations.map((item) => {
                const mapUrl = safeExternalUrl(text(item.raw.mapUrl ?? item.raw.url ?? item.raw.map, language));
                return <article key={`${item.title}-${item.originalIndex}`} data-testid={`card-food-location-${item.originalIndex + 1}`}>
                  <MapPin aria-hidden="true" />
                  <div><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}
                    {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-food-map-${item.originalIndex + 1}`}>{ar ? "افتح الموقع" : "Open map"}<ArrowUpRight aria-hidden="true" /></a>}
                  </div>
                </article>;
              })}
            </div>
            : customization.business.address
              ? <div className="tp-food-location-address"><MapPin aria-hidden="true" /><span>{customization.business.address[language]}</span></div>
              : <OwnerPrompt>{ar ? "أضف عنواناً أو رابط موقع الفرع بعد تأكيده." : "Add a confirmed branch address or map link."}</OwnerPrompt>}
        </section>;
      }

      if (section.type === "contact") return <section
        key={section.id}
        id="tp-contact"
        className="tp-food-contact"
        data-testid="section-preview-contact"
      >
        <div className="tp-food-contact-copy">
          <span className="tp-food-eyebrow">{ar ? "يسعدنا تواصلكم" : "A note before you visit"}</span>
          <SectionHeading section={section} language={language} />
        </div>
        <ContactActions customization={customization} language={language} variant="tp-food-contact-actions" />
      </section>;

      return null;
    })}

    <footer className="tp-food-footer">
      <div className="tp-food-footer-main">
        <div className="tp-food-footer-brand">
          <a href="#tp-top" data-testid="link-food-footer-brand">
            {customization.brand.logo
              ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} />
              : <span className="tp-food-footer-mark" aria-hidden="true"><UtensilsCrossed /></span>}
            <strong>{customization.business.name[language]}</strong>
          </a>
          {customization.business.tagline && <p>{customization.business.tagline[language]}</p>}
        </div>
        {hasContactDetails && <ContactActions customization={customization} language={language} variant="tp-food-footer-actions" />}
        {socials.length > 0 && <nav className="tp-food-social-links" aria-label={ar ? "روابط التواصل الاجتماعي" : "Social links"}>
          <span>{ar ? "روابط المكان" : "Find us online"}</span>
          {socials.map((social, socialIndex) => <a
            key={`${social.href}-${socialIndex}`}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-food-social-${socialIndex + 1}`}
          >{social.label}<ArrowUpRight aria-hidden="true" /></a>)}
        </nav>}
      </div>
      <div className="tp-food-footer-base">
        <span>{ar ? "معاينة قابلة للتخصيص — أضف بياناتك المعتمدة قبل النشر." : "Editable preview — add confirmed business details before publishing."}</span>
        <a href="#tp-top" data-testid="link-food-back-to-top">{ar ? "للأعلى" : "Back to top"}<ArrowUpRight aria-hidden="true" /></a>
      </div>
    </footer>
  </main>;
}
