import type { APIRoute } from "astro";
import { healthResponseSchema } from "../../lib/validation/health";

export const GET: APIRoute = () => {
  const body = healthResponseSchema.parse({
    status: "ok",
    application: "Website Factory",
    environment: import.meta.env.DEV ? "development" : "production",
  });

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
