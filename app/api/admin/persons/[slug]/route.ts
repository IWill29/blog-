import { NextRequest, NextResponse } from 'next/server'
import { deletePerson, updatePerson } from '@/lib/admin-content'
import { slug as slugify } from 'github-slugger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const routeParams = await params
  const currentSlug = routeParams.slug
  const formData = await request.formData()
  const action = String(formData.get('_action') || 'update')

  if (action === 'delete') {
    try {
      await deletePerson(currentSlug)
      return NextResponse.redirect(new URL('/admin/persons?success=deleted', request.url))
    } catch {
      return NextResponse.redirect(new URL('/admin/persons?error=delete', request.url))
    }
  }

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
    return NextResponse.redirect(
      new URL(`/admin/persons/${currentSlug}/edit?error=required`, request.url)
    )
  }

  const safeSlug = slugInput || slugify(name)

  try {
    const updatedSlug = await updatePerson(currentSlug, {
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

    return NextResponse.redirect(
      new URL(`/admin/persons/${updatedSlug}/edit?success=updated`, request.url)
    )
  } catch (error) {
    const reason = error instanceof Error && error.message.includes('exists') ? 'exists' : 'invalid'
    return NextResponse.redirect(
      new URL(`/admin/persons/${currentSlug}/edit?error=${reason}`, request.url)
    )
  }
}
