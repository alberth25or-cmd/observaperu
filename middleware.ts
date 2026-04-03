import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/redaccion/login') return NextResponse.next()
  if (pathname.startsWith('/api/redaccion/login')) return NextResponse.next()

  const auth = req.cookies.get('redaccion_auth')?.value
  const password = process.env.REVIEW_PASSWORD

  if (!password || auth !== password) {
    const loginUrl = new URL('/redaccion/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/redaccion/:path*', '/api/redaccion/:path*'],
}
