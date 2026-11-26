import type { CSSProperties } from "react";
import type { TemplatePreviewProps } from "../../lib/templates/types";
import ServicesLayout from "./layout-services";
import ContractingLayout from "./layout-contracting";
import CorporateLayout from "./layout-corporate";
import FoodLayout from "./layout-food";
import ShopLayout from "./layout-shop";
import LegalLayout from "./layout-legal";
import "./template-preview.css";

export default function TemplatePreview({ template, language, customization }: TemplatePreviewProps) {
  const allowed = new Set(template.supportedSections);
  const configured = customization.sections
    .filter((section) => allowed.has(section.type))
    .sort((left, right) => left.order - right.order);
  const sections = configured.length
    ? configured.filter((section) => section.visible)
    : template.supportedSections.map((type, order) => ({
        id: `${template.slug}-${type}`,
        type,
        order,
        visible: true,
        content: {},
      }));
  const styles = {
    "--tp-primary": customization.brand.colors.primary,
    "--tp-secondary": customization.brand.colors.secondary,
    "--tp-accent": customization.brand.colors.accent,
    "--tp-background": customization.brand.colors.background,
    "--tp-text": customization.brand.colors.text,
    "--tp-heading-font": fontStack(customization.brand.typography.heading),
    "--tp-body-font": fontStack(customization.brand.typography.body),
  } as CSSProperties;
  const props = { template, language, customization, sections, styles };

  switch (template.category) {
    case "services-maintenance": return <ServicesLayout {...props} />;
    case "contracting-real-estate": return <ContractingLayout {...props} />;
    case "corporate-professional": return <CorporateLayout {...props} />;
    case "restaurants-cafes-juice": return <FoodLayout {...props} />;
    case "shops-personal-services": return <ShopLayout {...props} />;
    case "law-firms-legal": return <LegalLayout {...props} />;
    default: return <ServicesLayout {...props} />;
  }
}

function fontStack(font: TemplatePreviewProps["customization"]["brand"]["typography"]["body"]) {
  return ({
    system: "system-ui, sans-serif",
    "arabic-sans": "'IBM Plex Sans Arabic', sans-serif",
    "editorial-serif": "Georgia, 'IBM Plex Sans Arabic', serif",
    "modern-sans": "'DM Sans', 'IBM Plex Sans Arabic', sans-serif",
  })[font];
}
