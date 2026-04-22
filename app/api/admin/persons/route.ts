import { NextRequest, NextResponse } from 'next/server'
import { createPerson } from '@/lib/admin-content'
import { slug as slugify } from 'github-slugger'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const name = String(formData.get('name') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const occupation = String(formData.get('occupation') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const twitter = String(formData.get('twitter') || '').trim()
  const linkedin = String(formData.get('linkedin') || '').trim()
  const github = String(formData.get('github') || '').trim()
  const avatar = String(formData.get('avatar') || '').trim()
  const content = String(formData.get('content') || '').trim()

  if (!name || !content) {
    return NextResponse.redirect(new URL('/admin/persons/new?error=required', request.url), {
      status: 303,
    })
  }

  const safeSlug = slugInput || slugify(name)

  try {
    await createPerson({
      name,
      slug: safeSlug,
      occupation,
      company,
      email,
      twitter,
      linkedin,
      github,
      avatar,
      content,
    })

    return NextResponse.redirect(new URL('/admin/persons?success=created', request.url), {
      status: 303,
    })
  } catch (error) {
    const reason = error instanceof Error && error.message.includes('exists') ? 'exists' : 'invalid'
    return NextResponse.redirect(
      new URL(`/admin/persons/new?error=${reason}&slug=${encodeURIComponent(safeSlug)}`, request.url),
      { status: 303 }
    )
  }
}
