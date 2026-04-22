const ADMIN_SESSION_COOKIE = 'admin_session'

const encoder = new TextEncoder()

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function getAdminSessionToken() {
  const username = process.env.ADMIN_PANEL_USERNAME
  const password = process.env.ADMIN_PANEL_PASSWORD
  const secret = process.env.ADMIN_PANEL_SECRET || 'admin-panel-secret'

  if (!username || !password) {
    return null
  }

  return sha256(`${username}:${password}:${secret}`)
}

export async function isValidAdminSession(sessionCookie: string | undefined) {
  if (!sessionCookie) {
    return false
  }

  const expectedToken = await getAdminSessionToken()
  return Boolean(expectedToken && sessionCookie === expectedToken)
}

export { ADMIN_SESSION_COOKIE }
