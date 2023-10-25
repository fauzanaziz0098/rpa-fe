import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  if (cookies.has("auth")) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/master-data/:path*", "/system-activity/:path*", "/home"],
};
