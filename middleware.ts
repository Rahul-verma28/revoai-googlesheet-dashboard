import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Paths to protect for logged-in users
  const protectedPaths = ["/", ];

  const authPaths = ["/login", "/signup"];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname === path
  );

  const isAuthPage = authPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/table/:path*"], // Protects dashboard routes
};