# Website templates

The built-in catalog is defined in `registry.ts`. It contains six stable IDs that correspond to additive seed rows in the existing D1 `templates` table. Each definition includes localized names and descriptions, a category, and the section types supported by that template.

`config.ts` validates the versioned customization format used with the existing `website_settings.settings_json` column. It supports localized business content, accessible logo/image alt text, five brand colors, heading/body font presets, ordered/visible sections, and HTTPS appointment links. Colors and URLs are validated before the preview applies them.

Page and reusable-section records are modeled by `website_pages`, `website_sections`, and `website_page_sections`. The association table uses composite foreign keys so a section can only be attached to a page belonging to the same website. It can reuse a section across pages of that website.

The admin template gallery and `/admin/templates/preview/:templateId` render only registry definitions with local demo data. The routes remain behind the existing admin authorization middleware; previews do not load or change customer, website, or account records. The legal template leaves contact details, credentials, licenses, and accreditation empty until an owner supplies verified information.

Apply the additive migration to local D1 with:

```sh
pnpm --filter @workspace/website-factory run db:migrate:local
```

Do not apply this migration to a remote database as part of Phase 4A.
