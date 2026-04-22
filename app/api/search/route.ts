import { NextResponse } from 'next/server'
import { getAllPublicPosts } from '@/lib/public-data'

export async function GET() {
  try {
    const posts = await getAllPublicPosts()
    const searchItems = posts.map((post) => ({
      title: post.title,
      summary: post.summary,
      date: post.date,
      path: post.path,
    }))

    return NextResponse.json(searchItems, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch {
    return NextResponse.json([])
  }
}
