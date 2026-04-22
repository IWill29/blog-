import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/admin-content'
import { resolvePostImageValue } from '@/lib/admin-upload'
import { slug as slugify } from 'github-slugger'

function splitTags(rawTags: string) {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const title = String(formData.get('title') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const date = String(formData.get('date') || '').trim()
  const summary = String(formData.get('summary') || '').trim()
  const tagsInput = String(formData.get('tags') || '').trim()
  const content = String(formData.get('content') || '').trim()

  if (!title || !date || !content) {
    return NextResponse.redirect(new URL('/admin/posts/new?error=required', request.url))
  }

  const safeSlug = slugInput || slugify(title)

  try {
    const image = await resolvePostImageValue({ formData })

    await createPost({
      title,
      slug: safeSlug,
      date,
      summary,
      image,
      tags: splitTags(tagsInput),
      content,
    })

    return NextResponse.redirect(new URL('/admin/posts?success=created', request.url), {
      status: 303,
    })
  } catch (error) {
    console.error('Create post failed:', error)
    const errorMessage = error instanceof Error ? error.message : ''
    const reason = errorMessage.includes('exists')
      ? 'exists'
      : errorMessage.includes('Invalid image type')
        ? 'image'
        : 'invalid'
    return NextResponse.redirect(
      new URL(`/admin/posts/new?error=${reason}&slug=${encodeURIComponent(safeSlug)}`, request.url),
      { status: 303 }
    )
  }
}
