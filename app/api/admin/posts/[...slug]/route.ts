import { NextRequest, NextResponse } from 'next/server'
import { deletePost, updatePost } from '@/lib/admin-content'
import { slug as slugify } from 'github-slugger'

function splitTags(rawTags: string) {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const routeParams = await params
  const currentSlug = routeParams.slug.join('/')
  const formData = await request.formData()
  const action = String(formData.get('_action') || 'update')

  if (action === 'delete') {
    try {
      await deletePost(currentSlug)
      return NextResponse.redirect(new URL('/admin/posts?success=deleted', request.url))
    } catch {
      return NextResponse.redirect(new URL('/admin/posts?error=delete', request.url))
    }
  }

  const title = String(formData.get('title') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const date = String(formData.get('date') || '').trim()
  const summary = String(formData.get('summary') || '').trim()
  const tagsInput = String(formData.get('tags') || '').trim()
  const content = String(formData.get('content') || '').trim()

  if (!title || !date || !content) {
    return NextResponse.redirect(
      new URL(`/admin/posts/edit/${currentSlug}?error=required`, request.url)
    )
  }

  const safeSlug = slugInput || slugify(title)

  try {
    const updatedSlug = await updatePost(currentSlug, {
      title,
      slug: safeSlug,
      date,
      summary,
      tags: splitTags(tagsInput),
      content,
    })

    return NextResponse.redirect(
      new URL(`/admin/posts/edit/${updatedSlug}?success=updated`, request.url)
    )
  } catch (error) {
    const reason = error instanceof Error && error.message.includes('exists') ? 'exists' : 'invalid'
    return NextResponse.redirect(
      new URL(`/admin/posts/edit/${currentSlug}?error=${reason}`, request.url)
    )
  }
}
