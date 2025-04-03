import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  const path = request.nextUrl.pathname
  const permissions = token.permissions as any[] || []

  // Admin panel access check
  if (path.startsWith("/admin")) {
    const hasAdminAccess = permissions.some(
      p => p.resource === "admin" && p.action === "access_admin_panel"
    )

    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Redirect /admin to /admin/dashboard
    if (path === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  // Location specific checks
  if (path.startsWith("/admin/locations")) {
    const canViewLocations = permissions.some(
      p => p.resource === "locations" && p.action === "view"
    )
    
    if (!canViewLocations) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ]
}