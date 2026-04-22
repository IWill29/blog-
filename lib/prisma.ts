import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined
  var __prismaAdapterUrl__: string | undefined
}

function normalizeDatabaseUrl(rawUrl: string) {
  try {
    const parsedUrl = new URL(rawUrl)
    const sslMode = parsedUrl.searchParams.get('sslmode')
    const weakSslModes = new Set(['prefer', 'require', 'verify-ca'])

    if (!sslMode || weakSslModes.has(sslMode)) {
      parsedUrl.searchParams.set('sslmode', 'verify-full')
    }

    return parsedUrl.toString()
  } catch {
    return rawUrl
  }
}

export function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing')
  }
  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl)

  const existingClient = global.__prisma__
  if (existingClient && global.__prismaAdapterUrl__ === normalizedDatabaseUrl) {
    return existingClient
  }

  const adapter = new PrismaPg({ connectionString: normalizedDatabaseUrl })
  const prisma = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    global.__prisma__ = prisma
    global.__prismaAdapterUrl__ = normalizedDatabaseUrl
  }

  return prisma
}
