import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { apiError, isSameOriginRequest } from "./lib/api/json";
import { findAccountById, toAuthUser } from "./lib/auth/accounts";
import { canAccessPrivateRoute, isProtectedPath } from "./lib/auth/policy";
import { AUTH_SESSION_KEY, isAuthSessionValid } from "./lib/auth/session";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = new URL(context.request.url).pathname;

  context.locals.authUser = null;

  if (pathname === "/admin/login") {
    if (!context.session) return next();

    try {
      const sessionData = await context.session.get(AUTH_SESSION_KEY);
      if (!isAuthSessionValid(sessionData)) {
        if (sessionData !== undefined) context.session.destroy();
        return next();
      }

      const account = await findAccountById(env.DB, sessionData.userId);
      if (!account || account.is_active !== 1) {
        context.session.destroy();
        return next();
      }

      context.locals.authUser = toAuthUser(account);
      return context.redirect("/admin", 302);
    } catch {
      return new Response("Authentication service unavailable", {
        status: 503,
      });
    }
  }

  if (!isProtectedPath(pathname)) return next();

  const session = context.session;
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return apiError("Authentication service unavailable", 503);
    }
    return new Response("Authentication service unavailable", { status: 503 });
  }

  try {
    const sessionData = await session.get(AUTH_SESSION_KEY);
    if (!isAuthSessionValid(sessionData)) {
      if (sessionData !== undefined) session.destroy();

      if (pathname === "/admin/login") return next();
      if (pathname.startsWith("/api/")) {
        return apiError("Authentication required", 401);
      }
      return context.redirect("/admin/login", 302);
    }

    const account = await findAccountById(env.DB, sessionData.userId);
    if (!account || account.is_active !== 1) {
      session.destroy();
      if (pathname === "/admin/login") return next();
      if (pathname.startsWith("/api/")) {
        return apiError("Authentication required", 401);
      }
      return context.redirect("/admin/login", 302);
    }

    const user = toAuthUser(account);
    context.locals.authUser = user;

    if (pathname === "/admin/login") {
      return context.redirect("/admin", 302);
    }

    if (!canAccessPrivateRoute(user.role, pathname, context.request.method)) {
      return apiError("Insufficient permissions", 403);
    }

    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(context.request.method) &&
      !isSameOriginRequest(context.request)
    ) {
      return apiError("Cross-origin request rejected", 403);
    }

    return next();
  } catch {
    return pathname.startsWith("/api/")
      ? apiError("Authentication service unavailable", 503)
      : new Response("Authentication service unavailable", { status: 503 });
  }
});
