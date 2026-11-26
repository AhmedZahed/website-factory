import type { AdminRole } from "./types";

const publicPaths = new Set([
  "/admin/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/health",
]);

export function isProtectedPath(pathname: string): boolean {
  if (publicPaths.has(pathname)) return false;
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/")
  );
}

export function canAccessPrivateRoute(
  role: AdminRole,
  pathname: string,
  method: string,
): boolean {
  if (role === "admin") return true;

  const upperMethod = method.toUpperCase();
  const isCustomerDelete =
    pathname.startsWith("/api/customers/") && upperMethod === "DELETE";
  const isAdminApi =
    pathname === "/api/admin" || pathname.startsWith("/api/admin/");

  return !isCustomerDelete && !isAdminApi;
}
