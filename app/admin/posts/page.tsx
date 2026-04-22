import Link from '@/components/Link'
import { listPosts } from '@/lib/admin-content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Admin Posts' })

type PostsPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  let posts: Awaited<ReturnType<typeof listPosts>> = []
  let databaseError = ''
  try {
    posts = await listPosts()
  } catch (error) {
    databaseError = error instanceof Error ? error.message : 'Database connection failed'
  }
  const params = await searchParams
  const showSuccess = Boolean(params.success)
  const showError = Boolean(params.error)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Posts</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Izveido, rediģē un dzēs bloga ierakstus no admin paneļa.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          + New post
        </Link>
      </div>
      {showSuccess && (
        <p className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          Darbība pabeigta veiksmīgi.
        </p>
      )}
      {showError && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          Neizdevās izpildīt darbību. Pamēģini vēlreiz.
        </p>
      )}
      {databaseError && (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          Neon DB nav pieslēgts: {databaseError}. Ieliec reālu `DATABASE_URL` un palaid `yarn prisma:push`.
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{post.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{post.date}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-500 hover:text-primary-600 mr-3 dark:hover:text-primary-400"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/posts/edit/${post.slug}`}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
