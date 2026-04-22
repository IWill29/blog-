import TestimonialGrid from '@/components/ui/testimonial'
import { genPageMetadata } from 'app/seo'
import { getAllPublicPersons } from '@/lib/public-data'

export const metadata = genPageMetadata({ title: 'About' })

function getShortQuote(content: string) {
  const firstBlock = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find(Boolean)

  if (!firstBlock) {
    return 'Personas apraksts tiks pievienots drīzumā.'
  }

  return firstBlock.length > 110 ? `${firstBlock.slice(0, 107)}...` : firstBlock
}

export default async function Page() {
  const persons = await getAllPublicPersons()
  const fallbackAvatars = [
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
  ]

  const testimonialItems = persons.map((person, index) => ({
    id: person.slug,
    imageSrc: person.avatar || fallbackAvatars[index % fallbackAvatars.length],
    quote: getShortQuote(person.content),
    name: person.name,
    role: [person.occupation, person.company].filter(Boolean).join(' @ ') || 'Team member',
    socialLinks: {
      email: person.email || undefined,
      linkedin: person.linkedin || undefined,
      facebook: person.twitter || undefined,
    },
  }))

  return (
    <div className="pt-8 pb-10">
      <TestimonialGrid items={testimonialItems} className="mx-auto max-w-6xl" />
    </div>
  )
}
