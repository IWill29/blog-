import Link from '@/components/Link'
import { listPersons } from '@/lib/admin-content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Admin Persons' })

type PersonsPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AdminPersonsPage({ searchParams }: PersonsPageProps) {
  const people = await listPersons()
  const params = await searchParams
  const showSuccess = Boolean(params.success)
  const showError = Boolean(params.error)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Persons</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Pārvaldi personas, kas tiek rādītas About sadaļā.
          </p>
        </div>
        <Link
          href="/admin/persons/new"
          className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          + New person
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

      <div className="grid gap-4 md:grid-cols-2">
        {people.map((author) => (
          <div
            key={author.slug}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{author.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{author.occupation}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{author.company}</p>
            <div className="mt-3">
              <Link
                href={`/admin/persons/${author.slug}/edit`}
                className="text-primary-500 hover:text-primary-600 text-sm dark:hover:text-primary-400"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {people.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No persons found.
          </div>
        )}
      </div>
    </div>
  )
}
