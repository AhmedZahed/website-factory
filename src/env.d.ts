/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare/types" />
/// <reference types="@cloudflare/workers-types" />

import type { Env as WebsiteFactoryBindings } from "./lib/database/bindings";

declare global {
  namespace Cloudflare {
    interface Env extends WebsiteFactoryBindings {}
  }
}

export {};
