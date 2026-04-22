import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'New Person' })

type NewPersonPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function NewPersonPage({ searchParams }: NewPersonPageProps) {
  const params = await searchParams
  const hasError = Boolean(params.error)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Create Person
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Šis profils tiks izmantots About sadaļā.
        </p>
      </div>

      {hasError && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          Neizdevās izveidot personu. Pārbaudi laukus un slug unikālumu.
        </p>
      )}

      <form action="/api/admin/persons" method="POST" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Name *</span>
            <input
              name="name"
              required
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input
              name="slug"
              placeholder="john-doe"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Occupation</span>
            <input
              name="occupation"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Company</span>
            <input
              name="company"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input
              name="email"
              type="email"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Avatar path</span>
            <input
              name="avatar"
              placeholder="/static/images/avatar.png"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium">X/Twitter</span>
            <input
              name="twitter"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">LinkedIn</span>
            <input
              name="linkedin"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">GitHub</span>
            <input
              name="github"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Bio (MDX) *</span>
          <textarea
            name="content"
            required
            rows={12}
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
          >
            Save person
          </button>
          <Link
            href="/admin/persons"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
