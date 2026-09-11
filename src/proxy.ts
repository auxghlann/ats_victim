import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/tracker", "/tasks", "/interviews"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("__session")?.value;
  const isDevBypass =
    process.env.NODE_ENV !== "production" &&
    (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true" ||
      process.env.DEV_AUTH_BYPASS === "true");
  const isAuthenticated = Boolean(sessionCookie) || isDevBypass;

  // If authenticated with real session cookie and visiting /login, redirect to /tracker
  if (pathname === "/login" && sessionCookie) {
    return NextResponse.redirect(new URL("/tracker", request.url));
  }

  // Check if current route is protected or root dashboard
  const isProtectedRoute =
    pathname === "/" || PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
