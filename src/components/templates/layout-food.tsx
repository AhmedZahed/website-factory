import { ArrowUpRight, MapPin, UtensilsCrossed } from "lucide-react";
import {
  ContactSection, DemoImage, HeroCopy, HoursPlaceholder, OwnerPrompt, PreviewFooter,
  SectionHeading, SectionNav, SectionAttrs, itemsFor, sectionTarget, type PreviewProps,
} from "./preview-shared";

export default function FoodLayout({ template, language, customization, sections, styles }: PreviewProps) {
  const ar = language === "ar";
  const menuVisible = sections.some((section) => section.type === "menu");
  const menuTarget = sectionTarget(sections, "menu");
  const contactTarget = sectionTarget(sections, "contact");
  return <main style={styles} className="tp-root tp-layout tp-layout-food" data-template-layout="restaurants-cafes-juice" data-testid="template-preview-restaurants-cafes-juice" dir={ar ? "rtl" : "ltr"} lang={language} id="tp-top">
    <div className="tp-demo-ribbon"><span>{ar ? "وجهة محلية" : "A LOCAL TABLE"}</span><span>{template.name[language]}</span></div>
    <header className="tp-food-header"><a href="#tp-top" className="tp-food-brand">{customization.brand.logo ? <img src={customization.brand.logo.src} alt={customization.brand.logo.alt[language]} /> : <UtensilsCrossed />}{customization.business.name[language]}</a><SectionNav sections={sections} language={language} /><a href={menuVisible ? menuTarget : contactTarget} className="tp-food-menu-link">{menuVisible ? (ar ? "استكشف القائمة" : "Explore menu") : (ar ? "تواصل معنا" : "Get in touch")}<ArrowUpRight /></a></header>
    {sections.map((section, index) => {
      if (section.type === "hero") return <section key={section.id} className="tp-food-hero">
        <div className="tp-food-hero-copy"><HeroCopy section={section} language={language} customization={customization} ctaHref={menuVisible ? menuTarget : contactTarget} ctaLabel={menuVisible ? (ar ? "استكشف القائمة" : "Explore menu") : (ar ? "تواصل معنا" : "Get in touch")} />
          <a className="tp-food-visit-link" href={contactTarget}>{ar ? "الزيارة والتواصل" : "Visit & contact"}<ArrowUpRight /></a></div>
        <div className="tp-food-cover"><DemoImage customization={customization} language={language} variant="food" /><div className="tp-food-stamp">{ar ? "مكانك على المائدة" : "A PLACE AT THE TABLE"}</div></div>
        <div className="tp-food-hero-foot"><span>{ar ? "قائمة • أجواء • زيارة" : "MENU · PLACE · VISIT"}</span><span>01 / 03</span></div>
      </section>;
      const props = SectionAttrs({ section, index, className: "tp-food-section" });
      if (section.type === "menu") return <section key={section.id} {...props} id="tp-menu">
        <div className="tp-food-menu-head"><span className="tp-layout-kicker">{ar ? "مختارات المكان" : "FROM OUR MENU"}</span><SectionHeading section={section} language={language} /></div>
        <div className="tp-menu-board">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`} className="tp-menu-line">
          <span className="tp-menu-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div>
          {item.meta && <span className="tp-menu-price">{item.meta}</span>}
        </article>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف الأصناف والأسعار المعتمدة من المكان." : "Add menu items and prices confirmed by the venue."}</OwnerPrompt>}
        </div>
        <p className="tp-menu-disclaimer">{ar ? "تُراجع الأصناف والأسعار قبل النشر." : "Menu items and prices should be reviewed before publishing."}</p>
        <a className="tp-food-order-anchor" href={contactTarget}>{ar ? "للاستفسار عن الطلبات" : "Ask about ordering"}<ArrowUpRight /></a>
      </section>;
      if (section.type === "story") return <section key={section.id} {...props} className="tp-food-story">
        <div><span className="tp-layout-kicker">{ar ? "من المكان" : "A NOTE FROM THE HOUSE"}</span><SectionHeading section={section} language={language} /></div>
        <div className="tp-food-story-copy">{itemsFor(section, language).map((item, i) => <p key={i}>{item.description || item.title}</p>)}
          {!itemsFor(section, language).length && <OwnerPrompt>{ar ? "أضف قصة المكان بكلماتك." : "Tell the story of your place in your own words."}</OwnerPrompt>}</div>
      </section>;
      if (section.type === "gallery") return <section key={section.id} {...props}>
        <SectionHeading section={section} language={language} kicker={ar ? "تفاصيل المكان" : "THE SPACE"} />
        {customization.images.gallery.length
          ? <div className="tp-food-gallery">{customization.images.gallery.slice(0, 6).map((image, i) => <figure key={`${image.src}-${i}`}><img src={image.src} alt={image.alt[language]} loading="lazy" /><figcaption>{image.alt[language]}</figcaption></figure>)}</div>
          : <div className="tp-food-gallery-empty"><DemoImage customization={customization} language={language} variant="food" index={1} /><OwnerPrompt>{ar ? "أضف صوراً أصلية للأطباق أو المكان." : "Add original images of your food or space."}</OwnerPrompt></div>}
      </section>;
      if (section.type === "opening-hours") return <section key={section.id} {...props} className="tp-food-hours">
        <div><span className="tp-layout-kicker">{ar ? "خطط لزيارتك" : "PLAN YOUR VISIT"}</span><SectionHeading section={section} language={language} /></div>
        {itemsFor(section, language).length
          ? <div className="tp-hours-schedule">{itemsFor(section, language).map((item, i) => <div key={`${item.title}-${i}`}><strong>{item.title}</strong><span>{item.description}</span></div>)}</div>
          : <HoursPlaceholder language={language} />}
      </section>;
      if (section.type === "locations") return <section key={section.id} {...props} className="tp-food-locations">
        <div><span className="tp-layout-kicker">{ar ? "قريب منك" : "FIND US"}</span><SectionHeading section={section} language={language} /></div>
        {itemsFor(section, language).length
          ? <div className="tp-branch-list">{itemsFor(section, language).map((item, i) => <article key={`${item.title}-${i}`}><MapPin /><div><strong>{item.title}</strong><p>{item.description}</p></div></article>)}</div>
          : customization.business.address
          ? <div className="tp-location-address"><MapPin /><span>{customization.business.address[language]}</span></div>
          : <OwnerPrompt>{ar ? "أضف عنواناً أو رابط موقع الفرع بعد تأكيده." : "Add a confirmed branch address or map link."}</OwnerPrompt>}
      </section>;
      if (section.type === "contact") return <ContactSection key={section.id} section={section} language={language} customization={customization} layout="food" />;
      return <section key={section.id} {...props}><SectionHeading section={section} language={language} /><OwnerPrompt>{ar ? "أضف تفاصيل الزيارة المعتمدة." : "Add confirmed visitor information."}</OwnerPrompt></section>;
    })}
    <footer className="tp-food-bottomline">{ar ? "أهلاً بكم — أضف بيانات الزيارة قبل النشر." : "You’re welcome — confirm visitor details before publishing."}</footer>
    <PreviewFooter template={template} customization={customization} language={language} />
  </main>;
}
