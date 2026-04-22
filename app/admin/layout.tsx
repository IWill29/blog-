import Link from '@/components/Link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-10">
      <style>{`
        header,
        footer {
          display: none;
        }
      `}</style>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-3 py-1 font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-md px-3 py-1 font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Posts
          </Link>
          <Link
            href="/admin/persons"
            className="rounded-md px-3 py-1 font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Persons
          </Link>
        </div>

        <form action="/api/admin/auth" method="POST">
          <input type="hidden" name="action" value="logout" />
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </form>
      </div>
      {children}
    </div>
  )
}
