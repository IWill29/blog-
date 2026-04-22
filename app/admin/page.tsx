import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Admin' })

const cards = [
  {
    title: 'Posts',
    description: 'Pārvaldi bloga ierakstus (izveide, rediģēšana, dzēšana).',
    href: '/admin/posts',
  },
  {
    title: 'Persons',
    description: 'Pārvaldi About sadaļas personas un sociālos linkus.',
    href: '/admin/persons',
  },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Admin Panel</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Panelis nav redzams publiskajā navigācijā un ir pieejams tikai caur `/admin`.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{card.title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
