// If this file exists, check if it's affecting your notifications route
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the path to see if it's intercepting the notifications route
  console.log("Middleware intercepting:", request.nextUrl.pathname)

  // Return NextResponse.next() to allow the request to continue
  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Add paths that should NOT be affected by the middleware
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

