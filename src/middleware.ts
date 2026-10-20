import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, type Locale } from "@/i18n/config";

/**
 * Bangla is the default. Many Bangladeshi devices report an English browser language,
 * so we do not auto-switch on Accept-Language — only an explicit choice (cookie) changes it.
 */
function preferredLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(localeCookie)?.value;
  return isLocale(cookie) ? cookie : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segment = pathname.split("/")[1];
  if (isLocale(segment)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata routes and any file with an extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|.*\\..*).*)"],
};
