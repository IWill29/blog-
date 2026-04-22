import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Admin Login' })

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = params.next && params.next.startsWith('/') ? params.next : '/admin'
  const hasError = Boolean(params.error)

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        Admin Login
      </h1>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Ievadi admin piekļuves datus, lai atvērtu paneli.
      </p>

      <form
        action="/api/admin/auth"
        method="POST"
        className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <input type="hidden" name="next" value={nextPath} />
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </div>
        {hasError && (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            Login neizdevās. Pārbaudi piekļuves datus.
          </p>
        )}
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-4 py-2 font-medium text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
