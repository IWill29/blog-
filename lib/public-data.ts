import { slug as slugify } from 'github-slugger'
import { getPrismaClient } from '@/lib/prisma'

export type PublicPost = {
  slug: string
  path: string
  title: string
  summary: string
  image: string
  date: string
  tags: string[]
  content: string
}

export type PublicPerson = {
  slug: string
  name: string
  occupation: string
  company: string
  email: string
  twitter: string
  linkedin: string
  github: string
  avatar: string
  content: string
}

function toPublicPost(post: {
  slug: string
  title: string
  summary: string | null
  image: string | null
  date: Date
  tags: string[]
  content: string
}): PublicPost {
  return {
    slug: post.slug,
    path: `blog/${post.slug}`,
    title: post.title,
    summary: post.summary || '',
    image: post.image || '',
    date: post.date.toISOString(),
    tags: post.tags || [],
    content: post.content || '',
  }
}

export async function getAllPublicPosts() {
  const prisma = getPrismaClient()
  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
  })
  return posts.map(toPublicPost)
}

export async function getPublicPostBySlug(slug: string) {
  const prisma = getPrismaClient()
  const post = await prisma.post.findUnique({ where: { slug } })
  return post ? toPublicPost(post) : null
}

export async function getAllPublicPersons() {
  const prisma = getPrismaClient()
  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
  })
  return persons.map((person) => ({
    slug: person.slug,
    name: person.name,
    occupation: person.occupation || '',
    company: person.company || '',
    email: person.email || '',
    twitter: person.twitter || '',
    linkedin: person.linkedin || '',
    github: person.github || '',
    avatar: person.avatar || '',
    content: person.content || '',
  }))
}

export function getTagSlug(tag: string) {
  return slugify(tag)
}
