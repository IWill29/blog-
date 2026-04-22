import Link from '@/components/Link'
import { getAdminSiteSettings } from '@/lib/site-settings'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Site Settings' })

type SettingsPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function AdminSettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams
  const showSuccess = Boolean(params.success)
  const showError = Boolean(params.error)
  const settings = await getAdminSiteSettings()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Maini logo attēlu, kas redzams Header.
        </p>
      </div>

      {showSuccess && (
        <p className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          Iestatījumi saglabāti.
        </p>
      )}
      {showError && (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {params.error === 'db'
            ? 'Neizdevās saglabāt iestatījumus: nav izveidota SiteSettings tabula. Palaid `corepack yarn prisma:push` un pārstartē serveri.'
            : 'Neizdevās saglabāt iestatījumus.'}
        </p>
      )}

      <form action="/api/admin/settings" method="POST" encType="multipart/form-data" className="space-y-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Upload logo image</span>
          <input
            name="logoFile"
            type="file"
            accept="image/*"
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
            Ja izvēlēsies failu, tas aizvietos esošo logo.
          </span>
        </label>

        {settings.logoImage && (
          <p className="text-xs text-gray-500 dark:text-gray-400">Current logo: {settings.logoImage}</p>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input name="removeLogo" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
          <span>Noņemt esošo logo attēlu</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
          >
            Save settings
          </button>
          <Link
            href="/admin"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
