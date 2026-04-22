import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/admin-content'
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
    await createPost({
      title,
      slug: safeSlug,
      date,
      summary,
      tags: splitTags(tagsInput),
      content,
    })

    return NextResponse.redirect(new URL('/admin/posts?success=created', request.url))
  } catch (error) {
    const reason = error instanceof Error && error.message.includes('exists') ? 'exists' : 'invalid'
    return NextResponse.redirect(
      new URL(`/admin/posts/new?error=${reason}&slug=${encodeURIComponent(safeSlug)}`, request.url)
    )
  }
}
