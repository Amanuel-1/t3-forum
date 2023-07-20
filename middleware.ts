import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  console.log(req.cookies.get('token'))
}

export const config = {
  matcher: ["/login", "/test"]
}
