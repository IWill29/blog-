import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/admin-auth'

function normalizePathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function isAuthPath(pathname: string) {
  return pathname === '/admin/login' || pathname === '/api/admin/auth'
}

export async function middleware(request: NextRequest) {
  const { search } = request.nextUrl
  const pathname = normalizePathname(request.nextUrl.pathname)
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const hasValidSession = await isValidAdminSession(sessionCookie)

  if (isAuthPath(pathname)) {
    if (pathname === '/admin/login' && hasValidSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && !hasValidSession) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/api/admin') && !hasValidSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
