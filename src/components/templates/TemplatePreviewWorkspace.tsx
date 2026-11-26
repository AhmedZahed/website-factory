import { useEffect, useState } from "react";
import { ArrowUpLeft, ArrowUpRight, Languages } from "lucide-react";
import TemplatePreview from "./TemplatePreview";
import type {
  TemplateCustomization,
  TemplateDefinition,
  TemplateLanguage,
} from "../../lib/templates/types";
import "./template-preview-workspace.css";

export function TemplatePreviewWorkspace({
  template,
  customization,
}: {
  template: TemplateDefinition;
  customization: TemplateCustomization;
}) {
  const [language, setLanguage] = useState<TemplateLanguage>("ar");
  const isArabic = language === "ar";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic, language]);

  return (
    <>
      <nav
        className="template-preview-toolbar"
        aria-label={isArabic ? "أدوات المعاينة" : "Preview controls"}
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
      >
        <a href="/admin/templates" className="template-preview-back" data-testid="link-preview-back-to-gallery">
          {isArabic ? <ArrowUpRight size={16} aria-hidden="true" /> : <ArrowUpLeft size={16} aria-hidden="true" />}
          {isArabic ? "العودة إلى القوالب" : "Back to templates"}
        </a>
        <span className="template-preview-name">
          {isArabic ? "معاينة داخلية" : "Internal preview"}
          <span aria-hidden="true">·</span>
          {template.name[language]}
        </span>
        <button
          className="template-preview-language"
          type="button"
          data-testid="button-preview-language-toggle"
          aria-label={isArabic ? "Switch preview to English" : "حوّل المعاينة إلى العربية"}
          aria-pressed={!isArabic}
          onClick={() => setLanguage(isArabic ? "en" : "ar")}
        >
          <Languages size={16} aria-hidden="true" />
          {isArabic ? "English" : "العربية"}
        </button>
      </nav>
      <TemplatePreview
        template={template}
        language={language}
        customization={customization}
      />
    </>
  );
}
