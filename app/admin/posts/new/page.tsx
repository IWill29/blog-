import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'New Post' })

type NewPostPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams
  const hasError = Boolean(params.error)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Create Post
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Aizpildi obligātos laukus: virsraksts, datums un saturs.
        </p>
      </div>

      {hasError && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          Neizdevās izveidot ierakstu. Pārbaudi laukus un slug unikālumu.
        </p>
      )}

      <form action="/api/admin/posts" method="POST" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Title *</span>
            <input
              name="title"
              required
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input
              name="slug"
              placeholder="my-first-post"
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
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Tags</span>
            <input
              name="tags"
              placeholder="nextjs, blog, tutorial"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Summary</span>
          <input
            name="summary"
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Content (MDX) *</span>
          <textarea
            name="content"
            required
            rows={16}
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
            placeholder="Raksta saturs..."
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
          >
            Save post
          </button>
          <Link
            href="/admin/posts"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
