import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: cloudflare({ configPath: "./wrangler.jsonc" }),
  session: {
    ttl: 8 * 60 * 60,
    cookie: {
      name: "__Host-wf_session",
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: 8 * 60 * 60,
    },
  },
  integrations: [react()],
  base: process.env.BASE_PATH ?? "/",
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 4321),
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});
