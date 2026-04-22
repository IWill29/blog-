import Link from '@/components/Link'
import { getPersonBySlug } from '@/lib/admin-content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Edit Person' })

type EditPersonPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function EditPersonPage({ params, searchParams }: EditPersonPageProps) {
  const routeParams = await params
  const search = await searchParams
  let person: Awaited<ReturnType<typeof getPersonBySlug>> | null = null
  let databaseError = ''
  try {
    person = await getPersonBySlug(routeParams.slug)
  } catch (error) {
    databaseError = error instanceof Error ? error.message : 'Database connection failed'
  }
  const showSuccess = Boolean(search.success)
  const showError = Boolean(search.error)

  if (!person) {
    return (
      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        Nevar ielādēt personu: {databaseError}. Pārbaudi `DATABASE_URL` un palaid `yarn prisma:push`.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Person
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Current slug: {routeParams.slug}</p>
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

      <form
        action={`/api/admin/persons/${routeParams.slug}`}
        method="POST"
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Name *</span>
            <input
              name="name"
              required
              defaultValue={person.name}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input
              name="slug"
              defaultValue={person.slug}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Occupation</span>
            <input
              name="occupation"
              defaultValue={person.occupation}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Company</span>
            <input
              name="company"
              defaultValue={person.company}
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
              defaultValue={person.email}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Upload new avatar</span>
            <input
              name="avatarFile"
              type="file"
              accept="image/*"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              Ja izvēlēsies failu, tas aizvietos esošo avatāru.
            </span>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input name="removeAvatar" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          <span>Noņemt esošo avatāru</span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Facebook</span>
            <input
              name="facebook"
              defaultValue={person.twitter}
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">LinkedIn</span>
            <input
              name="linkedin"
              defaultValue={person.linkedin}
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
            defaultValue={person.content}
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
            Delete person
          </button>
          <Link
            href="/admin/persons"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
