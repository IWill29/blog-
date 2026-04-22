import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getAllPublicPosts } from '@/lib/public-data'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl
  const allPosts = await getAllPublicPosts()

  const blogRoutes = allPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.date,
  }))

  const routes = ['', 'blog', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
