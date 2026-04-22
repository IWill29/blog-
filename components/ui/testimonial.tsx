import Image from '@/components/Image'
import { Facebook, Linkedin, Mail } from '@/components/social-icons/icons'
import { cn } from '@/lib/utils'

export type TestimonialItem = {
  id: string
  imageSrc: string
  quote: string
  name: string
  role: string
  socialLinks?: {
    email?: string
    linkedin?: string
    facebook?: string
  }
}

type TestimonialGridProps = {
  items: TestimonialItem[]
  className?: string
}

export default function TestimonialGrid({ items, className }: TestimonialGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6', className)}>
      {items.map((item) => (
        <article
          key={item.id}
          className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-black text-white md:max-w-none"
        >
          <div className="relative overflow-hidden rounded-2xl">
            {item.imageSrc.startsWith('http') ? (
              <img
                src={item.imageSrc}
                alt={item.name}
                className="block h-52 w-full scale-[1.01] transform-gpu object-cover object-[center_20%] transition-transform duration-300 will-change-transform [backface-visibility:hidden] hover:scale-[1.04] sm:h-60 md:h-[300px]"
              />
            ) : (
              <Image
                src={item.imageSrc}
                alt={item.name}
                className="block h-52 w-full scale-[1.01] transform-gpu object-cover object-[center_20%] transition-transform duration-300 will-change-transform [backface-visibility:hidden] hover:scale-[1.04] sm:h-60 md:h-[300px]"
                width={600}
                height={600}
              />
            )}
            <div className="pointer-events-none absolute bottom-0 z-10 h-20 w-full bg-gradient-to-t from-black to-transparent sm:h-24 md:h-28" />
          </div>
          <div className="px-4 pb-3 sm:px-5 sm:pb-4">
            <p className="border-b border-gray-700/70 pb-3 text-sm leading-relaxed font-medium sm:pb-4">
              {item.quote}
            </p>
            <p className="mt-2.5 text-sm sm:mt-3">- {item.name}</p>
            <p className="text-xs font-bold text-white sm:text-sm">
              {item.role}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {item.socialLinks?.email && (
                <a
                  href={`mailto:${item.socialLinks.email}`}
                  className="text-gray-300 transition hover:text-white"
                  aria-label={`${item.name} email`}
                >
                  <Mail className="h-6 w-6 fill-current" />
                </a>
              )}
              {item.socialLinks?.linkedin && (
                <a
                  href={item.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition hover:text-white"
                  aria-label={`${item.name} LinkedIn`}
                >
                  <Linkedin className="h-6 w-6 fill-current" />
                </a>
              )}
              {item.socialLinks?.facebook && (
                <a
                  href={item.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition hover:text-white"
                  aria-label={`${item.name} Facebook`}
                >
                  <Facebook className="h-6 w-6 fill-current" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
