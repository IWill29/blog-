import { getAllPublicPosts } from '@/lib/public-data'
import Main from './Main'

export default async function Page() {
  const posts = await getAllPublicPosts()
  return <Main posts={posts} />
}
