import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "aureyaa_session";
const PROTECTED_PREFIXES = ["/account", "/admin"];

/**
 * Edge middleware only checks cookie PRESENCE (cheap, fast, no Node APIs
 * available at the edge). It is not proof of a valid session — that check
 * happens server-side in src/app/admin/layout.tsx and src/app/(storefront)/account/layout.tsx
 * via getServerSession(), which actually verifies the cookie against Firebase.
 * This middleware just avoids rendering protected pages for obviously-logged-out visitors.
 */
export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
