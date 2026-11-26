import { z } from "zod";

const MAX_JSON_BODY_BYTES = 16 * 1024;

export function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
): Response {
  const headers = new Headers(extraHeaders);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");

  return new Response(JSON.stringify(body), { status, headers });
}

export function apiError(
  message: string,
  status: number,
  details?: unknown,
): Response {
  return jsonResponse(
    details === undefined ? { error: message } : { error: message, details },
    status,
  );
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function zodFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.map(String).join(".") : "_";
    (fields[field] ??= []).push(issue.message);
  }
  return fields;
}

type JsonBodyResult<T> =
  | { success: true; data: T }
  | { success: false; response: Response };

async function readBoundedBody(request: Request): Promise<string | null> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_JSON_BODY_BYTES) {
    return null;
  }

  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_JSON_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

export async function readValidatedJson<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<JsonBodyResult<T>> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return {
      success: false,
      response: apiError("Content-Type must be application/json", 415),
    };
  }

  let body: string | null;
  try {
    body = await readBoundedBody(request);
  } catch {
    return {
      success: false,
      response: apiError("Unable to read request body", 400),
    };
  }

  if (body === null) {
    return {
      success: false,
      response: apiError("Request body exceeds the 16 KB limit", 413),
    };
  }

  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return {
      success: false,
      response: apiError("Request body must contain valid JSON", 400),
    };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      response: apiError(
        "Request validation failed",
        400,
        zodFieldErrors(parsed.error),
      ),
    };
  }

  return { success: true, data: parsed.data };
}
