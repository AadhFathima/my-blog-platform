import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      return !!token; // Require login for protected routes
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/blog/new", "/blog/edit/:path*"],
};