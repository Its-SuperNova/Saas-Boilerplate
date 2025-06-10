import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If accessing admin routes without a session, redirect to login
  if (request.nextUrl.pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If we have a session and are accessing admin routes, check the user's role
  if (session && request.nextUrl.pathname.startsWith("/admin")) {
    // Get the user's role from the database
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/check-role`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { role } = await response.json();

    // If user is not an admin, redirect to home
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
