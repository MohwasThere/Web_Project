import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/signup"];

const isPublicPath = (pathname: string) => {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  return pathname.startsWith("/_next") || pathname.startsWith("/favicon");
};

const isAuthOrInfraPath = (pathname: string) => {
  return pathname.startsWith("/api/auth") || pathname.startsWith("/api/inngest");
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname) || isAuthOrInfraPath(pathname)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionResponse = await fetch(new URL("/api/auth/get-session", request.url), {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  if (!sessionResponse.ok) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const sessionPayload = await sessionResponse.json().catch(() => null);
  if (!sessionPayload?.user) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
