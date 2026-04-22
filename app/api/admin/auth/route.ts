import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, getAdminSessionToken } from '@/lib/admin-auth'

function normalizeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith('/')) {
    return '/admin'
  }
  return nextPath
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const action = String(formData.get('action') || 'login')

  if (action === 'logout') {
    const response = NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 })
    response.cookies.delete(ADMIN_SESSION_COOKIE)
    return response
  }

  const username = String(formData.get('username') || '')
  const password = String(formData.get('password') || '')
  const nextPath = normalizeNextPath(String(formData.get('next') || '/admin'))
  const expectedUsername = process.env.ADMIN_PANEL_USERNAME
  const expectedPassword = process.env.ADMIN_PANEL_PASSWORD
  const sessionToken = await getAdminSessionToken()

  if (!expectedUsername || !expectedPassword || !sessionToken) {
    return NextResponse.redirect(new URL('/admin/login?error=config', request.url), { status: 303 })
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.redirect(new URL('/admin/login?error=credentials', request.url), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), { status: 303 })
  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return response
}
