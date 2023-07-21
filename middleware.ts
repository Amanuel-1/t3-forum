import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {

  const guest = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')

  if (req.nextUrl.pathname.startsWith('/test')) {
    return NextResponse.next()
  }

  // Middleware Guest
  if (req.cookies.get('token')) {

    if (guest || req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/forum', req.url))
    }

    return NextResponse.next()

  }

  // When token is undefined
  if (guest) return NextResponse.next()

  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {
  matcher: ["/login", "/test", "/forum"]
}
