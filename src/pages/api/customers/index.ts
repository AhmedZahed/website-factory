import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import {
  apiError,
  jsonResponse,
  readValidatedJson,
  zodFieldErrors,
} from "../../../lib/api/json";
import {
  createCustomer,
  isUniqueConstraintError,
  listCustomers,
} from "../../../lib/database/customers";
import {
  createCustomerSchema,
  listCustomersQuerySchema,
} from "../../../lib/validation/customer";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const parsedQuery = listCustomersQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );

  if (!parsedQuery.success) {
    return apiError(
      "Query validation failed",
      400,
      zodFieldErrors(parsedQuery.error),
    );
  }

  try {
    const customers = await listCustomers(env.DB, parsedQuery.data);
    return jsonResponse({
      customers,
      pagination: {
        limit: parsedQuery.data.limit,
        offset: parsedQuery.data.offset,
      },
    });
  } catch {
    return apiError("Unable to list customers", 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const parsedBody = await readValidatedJson(request, createCustomerSchema);
  if (!parsedBody.success) return parsedBody.response;

  try {
    const customer = await createCustomer(
      env.DB,
      crypto.randomUUID(),
      parsedBody.data,
    );
    if (!customer) {
      return apiError("Unable to create customer", 500);
    }
    return jsonResponse({ customer }, 201);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return apiError("A customer with this email already exists", 409);
    }
    return apiError("Unable to create customer", 500);
  }
};
