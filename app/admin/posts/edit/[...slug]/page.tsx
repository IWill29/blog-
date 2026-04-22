import Link from '@/components/Link'
import { getPostBySlug } from '@/lib/admin-content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Edit Post' })

type EditPostPageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
  const routeParams = await params
  const search = await searchParams
  const currentSlug = routeParams.slug.join('/')
  const post = await getPostBySlug(currentSlug)
  const showSuccess = Boolean(search.success)
  const showError = Boolean(search.error)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Post
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Current slug: {currentSlug}</p>
      </div>

      {showSuccess && (
        <p className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          Izmaiņas saglabātas.
        </p>
      )}
      {showError && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          Neizdevās saglabāt izmaiņas.
        </p>
      )}

      <form action={`/api/admin/posts/${currentSlug}`} method="POST" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Title *</span>
            <input
              name="title"
              required
              defaultValue={post.title}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input
              name="slug"
              defaultValue={post.slug}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Date *</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={post.date.slice(0, 10)}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Tags</span>
            <input
              name="tags"
              defaultValue={post.tags.join(', ')}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Summary</span>
          <input
            name="summary"
            defaultValue={post.summary}
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Content (MDX) *</span>
          <textarea
            name="content"
            required
            rows={16}
            defaultValue={post.content}
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
          >
            Save changes
          </button>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Delete post
          </button>
          <Link
            href="/admin/posts"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
