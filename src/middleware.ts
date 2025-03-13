import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Verify if user is authenticated and trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ]
}