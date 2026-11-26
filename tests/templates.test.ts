import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createDemoCustomization } from "../src/lib/templates/demo.ts";
import { templateCustomizationSchema } from "../src/lib/templates/config.ts";
import { TEMPLATE_REGISTRY } from "../src/lib/templates/registry.ts";
import type { TemplateCustomization } from "../src/lib/templates/types.ts";

test("registry contains six unique localized built-in templates", () => {
  assert.equal(TEMPLATE_REGISTRY.length, 6);
  assert.equal(new Set(TEMPLATE_REGISTRY.map((template) => template.id)).size, 6);
  assert.equal(new Set(TEMPLATE_REGISTRY.map((template) => template.slug)).size, 6);

  for (const template of TEMPLATE_REGISTRY) {
    assert.ok(template.name.ar.length > 0);
    assert.ok(template.name.en.length > 0);
    assert.ok(template.description.ar.length > 0);
    assert.ok(template.description.en.length > 0);
    assert.ok(template.supportedSections.includes("hero"));
    assert.ok(template.supportedSections.includes("contact"));
  }
});

test("every built-in demo uses valid configurable settings and supports its sections", () => {
  for (const template of TEMPLATE_REGISTRY) {
    const parsed = templateCustomizationSchema.parse(
      createDemoCustomization(template),
    );
    assert.equal(parsed.sections.length, template.supportedSections.length);
    assert.deepEqual(
      parsed.sections.map((section) => section.type),
      [...template.supportedSections],
    );
    assert.deepEqual(
      parsed.sections.map((section) => section.order),
      parsed.sections.map((_, index) => index),
    );
  }
});

test("configuration accepts customization but rejects unsafe URLs and styles", () => {
  const template = TEMPLATE_REGISTRY[0];
  const valid = createDemoCustomization(template);

  assert.equal(
    templateCustomizationSchema.safeParse({
      ...valid,
      brand: { ...valid.brand, colors: { ...valid.brand.colors, primary: "red" } },
    }).success,
    false,
  );
  assert.equal(
    templateCustomizationSchema.safeParse({
      ...valid,
      images: {
        hero: {
          src: "http://example.test/image.jpg",
          alt: { ar: "صورة", en: "Image" },
        },
        gallery: [],
      },
    }).success,
    false,
  );
  assert.equal(
    templateCustomizationSchema.safeParse({
      ...valid,
      business: { ...valid.business, appointmentUrl: "javascript:alert(1)" },
    }).success,
    false,
  );
  assert.equal(
    templateCustomizationSchema.safeParse({
      ...valid,
      sections: [
        ...valid.sections,
        { ...valid.sections[0], id: "duplicate-hero" },
      ],
    }).success,
    false,
  );
  assert.equal(
    templateCustomizationSchema.safeParse({
      ...valid,
      images: {
        hero: {
          src: "/images/hero.jpg",
          alt: { ar: "صورة توضيحية", en: "Illustrative image" },
        },
        gallery: [],
      },
    }).success,
    true,
  );
});

test("section visibility and ordering are represented in validated settings", () => {
  const template = TEMPLATE_REGISTRY[0];
  const config = createDemoCustomization(template);
  const reordered: TemplateCustomization = {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      order: section.type === "contact" ? 0 : section.order + 1,
      visible: section.type !== "benefits",
    })),
  };
  const parsed = templateCustomizationSchema.parse(reordered);
  const byOrder = [...parsed.sections].sort((a, b) => a.order - b.order);

  assert.equal(byOrder[0]?.type, "contact");
  assert.equal(parsed.sections.find((section) => section.type === "benefits")?.visible, false);
});

test("legal demo omits credentials and real contact details", () => {
  const template = TEMPLATE_REGISTRY.find(
    (entry) => entry.category === "law-firms-legal",
  );
  assert.ok(template);
  const config = templateCustomizationSchema.parse(
    createDemoCustomization(template),
  );

  assert.equal(config.business.phone, undefined);
  assert.equal(config.business.whatsapp, undefined);
  assert.equal(
    config.sections.find((section) => section.type === "accreditation")?.visible,
    false,
  );
  assert.ok(template.supportedSections.includes("practice-areas"));
  assert.ok(template.supportedSections.includes("qualifications"));
  assert.ok(template.supportedSections.includes("consultation"));
  assert.ok(template.supportedSections.includes("articles"));
  assert.ok(template.supportedSections.includes("faq"));
});

test("phase 4A migration is additive and links reusable sections within one website", async () => {
  const sql = await readFile(
    new URL("../migrations/0004_template_engine.sql", import.meta.url),
    "utf8",
  );

  assert.match(sql, /CREATE TABLE website_pages/i);
  assert.match(sql, /CREATE TABLE website_sections/i);
  assert.match(sql, /CREATE TABLE website_page_sections/i);
  assert.match(sql, /FOREIGN KEY \(page_id, website_id\)/i);
  assert.match(sql, /FOREIGN KEY \(section_id, website_id\)/i);
  assert.match(sql, /CREATE INDEX idx_website_pages_website_locale_status/i);
  assert.match(sql, /CREATE INDEX idx_website_sections_website_type/i);
  assert.match(sql, /INSERT OR IGNORE INTO templates/i);
  assert.doesNotMatch(sql, /\b(?:DROP|ALTER)\s+(?:TABLE|INDEX)\b/i);
  assert.doesNotMatch(sql, /\bDELETE\s+FROM\s+(?:customers|websites|admin_accounts)\b/i);
});
