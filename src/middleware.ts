import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const tokenFromClient = request.cookies.get("token")?.value as string;

  if (!tokenFromClient) {
    if (request.nextUrl.pathname.startsWith("/api/users/profile/")) {
      return NextResponse.json(
        { message: "no token provided, access denied" },
        { status: 401 } // Unauthorized
      );
    }
  } else {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/api/users/profile/:path*", "/login", "/register"]
};
