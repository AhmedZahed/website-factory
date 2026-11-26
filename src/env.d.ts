/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare/types" />
/// <reference types="@cloudflare/workers-types" />

import type { Env as WebsiteFactoryBindings } from "./lib/database/bindings";
import type { AuthSessionData, AuthUser } from "./lib/auth/types";

declare global {
  namespace Cloudflare {
    interface Env extends WebsiteFactoryBindings {}
  }

  namespace App {
    interface Locals {
      authUser: AuthUser | null;
    }

    interface SessionData {
      auth: AuthSessionData;
    }
  }
}

export {};
