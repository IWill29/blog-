import Image from '@/components/Image'
import { cn } from '@/lib/utils'

export type TestimonialItem = {
  id: string
  imageSrc: string
  quote: string
  name: string
  role: string
}

type TestimonialGridProps = {
  items: TestimonialItem[]
  className?: string
}

export default function TestimonialGrid({ items, className }: TestimonialGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', className)}>
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-2xl bg-black text-white">
          <div className="relative overflow-hidden rounded-2xl">
            {item.imageSrc.startsWith('http') ? (
              <img
                src={item.imageSrc}
                alt={item.name}
                className="h-[270px] w-full object-cover object-top transition-all duration-300 hover:scale-105"
              />
            ) : (
              <Image
                src={item.imageSrc}
                alt={item.name}
                className="h-[270px] w-full object-cover object-top transition-all duration-300 hover:scale-105"
                width={600}
                height={600}
              />
            )}
            <div className="pointer-events-none absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t from-black to-transparent" />
          </div>
          <div className="px-4 pb-4">
            <p className="border-b border-gray-600 pb-5 font-medium">{item.quote}</p>
            <p className="mt-4">- {item.name}</p>
            <p className="bg-gradient-to-r from-[#8B5CF6] via-[#E0724A] to-[#9938CA] bg-clip-text text-sm font-medium text-transparent">
              {item.role}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
