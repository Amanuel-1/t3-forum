import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getJwtSecret } from "./lib/utils"
import { deleteCookie } from "cookies-next"

export default async function middleware(req: NextRequest) {

  const guest = 
    req.nextUrl.pathname.startsWith('/login') || 
    req.nextUrl.pathname.startsWith('/register') ||
    req.nextUrl.pathname.startsWith('/api/trpc/auth.login') ||
    req.nextUrl.pathname.startsWith('/api/trpc/auth.register')

  if (req.nextUrl.pathname.startsWith('/test')) return NextResponse.next()

  // Verify Token
  const token = req.cookies.get('token')?.value

  if (!token) {
    if (guest) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // When token is exists, Validate their value
  const payload = await jwtVerify(token, new TextEncoder().encode(getJwtSecret()))
    .then(decoded => decoded.payload)
    .catch(err => null)

  if (!payload) {
    if (guest) return NextResponse.next()

    deleteCookie('token')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // When payload is not null (Valid)
  if (guest || req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/forum', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/test", "/forum", "/register", "/api/trpc/:path*", "/profil/:path*"]
}
