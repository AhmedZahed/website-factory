import { ArrowUpLeft, Eye, Layers3 } from "lucide-react";
import { TEMPLATE_REGISTRY } from "../../lib/templates/registry";
import type { TemplateLanguage } from "../../lib/templates/types";
import "./template-gallery.css";

const copy = {
  ar: {
    eyebrow: "مكتبة القوالب",
    title: "اختر نقطة البداية",
    intro: "ستة اتجاهات مرنة، لكل منها أقسامه وهويته الخاصة. افتح أي قالب لمعاينته ببيانات توضيحية فقط.",
    sections: "أقسام مدعومة",
    preview: "معاينة القالب",
    demo: "بيانات توضيحية",
  },
  en: {
    eyebrow: "Template library",
    title: "Choose a starting point",
    intro: "Six flexible directions, each with its own identity and supported sections. Previews use demo data only.",
    sections: "Supported sections",
    preview: "Preview template",
    demo: "Demo content",
  },
} satisfies Record<TemplateLanguage, Record<string, string>>;

export function TemplateRegistryGallery({
  language,
}: {
  language: TemplateLanguage;
}) {
  const labels = copy[language];
  const isArabic = language === "ar";

  return (
    <section className="template-gallery" aria-labelledby="template-gallery-title">
      <header className="template-gallery-heading">
        <div>
          <p className="template-gallery-eyebrow">{labels.eyebrow}</p>
          <h2 id="template-gallery-title">{labels.title}</h2>
          <p>{labels.intro}</p>
        </div>
        <span className="template-gallery-count" aria-label={`${TEMPLATE_REGISTRY.length}`}>
          <Layers3 size={16} aria-hidden="true" />
          {TEMPLATE_REGISTRY.length.toString().padStart(2, "0")}
        </span>
      </header>

      <div className="template-gallery-grid">
        {TEMPLATE_REGISTRY.map((template, index) => (
          <article
            className="template-gallery-card"
            data-template={template.category}
            key={template.id}
          >
            <a
              className="template-gallery-preview"
              href={`/admin/templates/preview/${template.id}`}
              aria-label={`${labels.preview}: ${template.name[language]}`}
            >
              <span className="template-gallery-browser" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="template-gallery-sample">
                <span className="template-gallery-sample-mark">
                  {template.name[language].slice(0, 1)}
                </span>
                <span className="template-gallery-sample-lines">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="template-gallery-sample-art" />
              </span>
              <span className="template-gallery-preview-tag">
                <Eye size={13} aria-hidden="true" />
                {labels.demo}
              </span>
            </a>

            <div className="template-gallery-card-copy">
              <span className="template-gallery-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{template.name[language]}</h3>
              <p>{template.description[language]}</p>
              <div className="template-gallery-card-footer">
                <span>
                  {template.supportedSections.length} {labels.sections}
                </span>
                <a href={`/admin/templates/preview/${template.id}`}>
                  {labels.preview}
                  {isArabic ? (
                    <ArrowUpLeft size={15} aria-hidden="true" />
                  ) : (
                    <ArrowUpLeft size={15} aria-hidden="true" />
                  )}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
