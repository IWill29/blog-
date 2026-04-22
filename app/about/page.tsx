import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const featuredAuthorSlugs = ['default', 'linda-audere', 'janis-berzins']
  const featuredAuthors = featuredAuthorSlugs
    .map((authorSlug) => allAuthors.find((author) => author.slug === authorSlug))
    .filter(Boolean) as Authors[]

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          About
        </h1>
      </div>
      <div className="space-y-12 pt-8 pb-8">
        {featuredAuthors.map((author) => (
          <section
            key={author.slug}
            className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0"
          >
            <div className="flex flex-col items-center space-x-2 pt-8">
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={`${author.name} avatar`}
                  width={192}
                  height={192}
                  className="h-48 w-48 rounded-full"
                />
              )}
              <h2 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{author.name}</h2>
              <div className="text-gray-500 dark:text-gray-400">{author.occupation}</div>
              <div className="text-gray-500 dark:text-gray-400">{author.company}</div>
              <div className="flex space-x-3 pt-6">
                <SocialIcon kind="mail" href={author.email ? `mailto:${author.email}` : undefined} />
                <SocialIcon kind="github" href={author.github} />
                <SocialIcon kind="linkedin" href={author.linkedin} />
                <SocialIcon kind="x" href={author.twitter} />
                <SocialIcon kind="bluesky" href={author.bluesky} />
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
              <MDXLayoutRenderer code={author.body.code} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
