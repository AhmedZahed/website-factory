import type { APIRoute } from "astro";
import { apiError, jsonResponse } from "../../../lib/api/json";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.authUser) return apiError("Authentication required", 401);
  return jsonResponse({ user: locals.authUser });
};
