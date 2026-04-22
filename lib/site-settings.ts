import { getPrismaClient } from '@/lib/prisma'

const SITE_SETTINGS_ID = 'default'

export async function getPublicSiteSettings() {
  try {
    const prisma = getPrismaClient()
    const rows = await prisma.$queryRaw<Array<{ logoImage: string | null }>>`
      SELECT "logoImage"
      FROM "SiteSettings"
      WHERE "id" = ${SITE_SETTINGS_ID}
      LIMIT 1
    `
    const settings = rows[0]

    return {
      logoImage: settings?.logoImage || '',
    }
  } catch {
    return {
      logoImage: '',
    }
  }
}

export async function getAdminSiteSettings() {
  try {
    const prisma = getPrismaClient()
    const rows = await prisma.$queryRaw<Array<{ logoImage: string | null }>>`
      SELECT "logoImage"
      FROM "SiteSettings"
      WHERE "id" = ${SITE_SETTINGS_ID}
      LIMIT 1
    `
    const settings = rows[0]

    return {
      logoImage: settings?.logoImage || '',
    }
  } catch {
    return {
      logoImage: '',
    }
  }
}

export async function updateSiteSettings(payload: {
  logoImage?: string
}) {
  const prisma = getPrismaClient()
  const logoImage = payload.logoImage || null

  await prisma.$executeRaw`
    INSERT INTO "SiteSettings" ("id", "logoImage", "createdAt", "updatedAt")
    VALUES (${SITE_SETTINGS_ID}, ${logoImage}, NOW(), NOW())
    ON CONFLICT ("id")
    DO UPDATE SET
      "logoImage" = EXCLUDED."logoImage",
      "updatedAt" = NOW()
  `
}
