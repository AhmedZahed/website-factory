import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { apiError, jsonResponse, readValidatedJson } from "../../../lib/api/json";
import {
  deleteCustomerIfUnlinked,
  findCustomer,
  isForeignKeyConstraintError,
  isUniqueConstraintError,
  updateCustomer,
} from "../../../lib/database/customers";
import {
  customerIdSchema,
  updateCustomerSchema,
} from "../../../lib/validation/customer";

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request }) => {
  const parsedId = customerIdSchema.safeParse(params.id);
  if (!parsedId.success) return apiError("Invalid customer ID", 400);

  const parsedBody = await readValidatedJson(request, updateCustomerSchema);
  if (!parsedBody.success) return parsedBody.response;

  try {
    const updated = await updateCustomer(
      env.DB,
      parsedId.data,
      parsedBody.data,
    );
    if (!updated) return apiError("Customer not found", 404);

    const customer = await findCustomer(env.DB, parsedId.data);
    if (!customer) return apiError("Customer not found", 404);
    return jsonResponse({ customer });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return apiError("A customer with this email already exists", 409);
    }
    return apiError("Unable to update customer", 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const parsedId = customerIdSchema.safeParse(params.id);
  if (!parsedId.success) return apiError("Invalid customer ID", 400);

  try {
    const deleted = await deleteCustomerIfUnlinked(env.DB, parsedId.data);
    if (deleted) {
      return new Response(null, {
        status: 204,
        headers: { "cache-control": "no-store" },
      });
    }

    const customer = await findCustomer(env.DB, parsedId.data);
    if (!customer) return apiError("Customer not found", 404);
    return apiError("Customer is linked to one or more websites", 409);
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      return apiError("Customer is linked to one or more websites", 409);
    }
    return apiError("Unable to delete customer", 500);
  }
};
