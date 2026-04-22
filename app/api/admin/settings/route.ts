import { NextRequest, NextResponse } from 'next/server'
import { resolveSiteLogoValue } from '@/lib/admin-upload'
import { getAdminSiteSettings, updateSiteSettings } from '@/lib/site-settings'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    const currentSettings = await getAdminSiteSettings()
    const logoImage = await resolveSiteLogoValue({
      formData,
      currentLogo: currentSettings.logoImage,
    })

    await updateSiteSettings({
      logoImage,
    })

    return NextResponse.redirect(new URL('/admin/settings?success=updated', request.url), {
      status: 303,
    })
  } catch (error) {
    console.error('Failed to save site settings', error)
    const message = error instanceof Error && error.message.includes('SiteSettings') ? 'db' : 'save'
    return NextResponse.redirect(new URL(`/admin/settings?error=${message}`, request.url), {
      status: 303,
    })
  }
}
