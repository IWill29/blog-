import Link from '@/components/Link'
import Image from '@/components/Image'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getAllPublicPosts, getPublicPostBySlug } from '@/lib/public-data'
import { formatDate } from 'pliny/utils/formatDate'

function renderParagraphs(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    return <p>Nav satura.</p>
  }

  return blocks.map((block, index) => (
    <p key={index} className="whitespace-pre-wrap">
      {block}
    </p>
  ))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = await getPublicPostBySlug(slug)

  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const imageList = [post.image || siteMetadata.socialBanner]

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: publishedAt,
      url: './',
      images: imageList.map((img) => ({ url: img })),
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  const posts = await getAllPublicPosts()
  return posts.map((post) => ({ slug: post.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const posts = await getAllPublicPosts()
  const postIndex = posts.findIndex((post) => post.slug === slug)

  if (postIndex < 0) {
    return notFound()
  }

  const post = posts[postIndex]
  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
    author: [{ '@type': 'Person', name: siteMetadata.author }],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="space-y-2 pt-6 pb-8 md:space-y-5">
          {post.image && (
            <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}
          <p className="text-base text-gray-500 dark:text-gray-400">
            {formatDate(post.date, siteMetadata.locale)}
          </p>
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            {post.title}
          </h1>
          {post.summary && <p className="text-lg text-gray-500 dark:text-gray-400">{post.summary}</p>}
        </header>

        <div className="prose dark:prose-invert max-w-none">{renderParagraphs(post.content)}</div>

        <footer className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="text-primary-500 hover:text-primary-600">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/blog/${next.slug}`} className="text-primary-500 hover:text-primary-600">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </footer>
      </article>
    </>
  )
}
