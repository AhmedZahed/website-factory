import type { AdminRole } from "./types";

const publicPaths = new Set([
  "/admin/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/health",
]);

const staffRouteAllowlist: Array<{
  path: RegExp;
  methods: ReadonlySet<string>;
}> = [
  { path: /^\/admin\/?$/, methods: new Set(["GET"]) },
  { path: /^\/admin\/customers\/?$/, methods: new Set(["GET"]) },
  { path: /^\/api\/auth\/me\/?$/, methods: new Set(["GET"]) },
  { path: /^\/api\/customers\/?$/, methods: new Set(["GET", "POST"]) },
  { path: /^\/api\/customers\/[^/]+\/?$/, methods: new Set(["PATCH"]) },
];

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
  return staffRouteAllowlist.some(
    (route) => route.path.test(pathname) && route.methods.has(upperMethod),
  );
}
