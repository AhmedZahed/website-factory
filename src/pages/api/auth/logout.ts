import type { APIRoute } from "astro";
import { apiError, isSameOriginRequest } from "../../../lib/api/json";

export const prerender = false;

export const POST: APIRoute = async ({ request, session }) => {
  if (!isSameOriginRequest(request)) {
    return apiError("Cross-origin request rejected", 403);
  }
  if (!session) return apiError("Authentication service unavailable", 503);

  session.destroy();
  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
};
