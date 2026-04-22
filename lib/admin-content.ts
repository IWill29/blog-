import { slug as slugify } from 'github-slugger'
import { getPrismaClient } from '@/lib/prisma'

type PostPayload = {
  title: string
  slug: string
  date: string
  summary?: string
  image?: string
  tags?: string[]
  content: string
}

type PersonPayload = {
  name: string
  slug: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  avatar?: string
  content: string
}

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Configure Neon connection string in .env.local')
  }
}

function normalizePostSlug(input: string) {
  const normalized = input
    .split('/')
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join('/')

  if (!normalized) {
    throw new Error('Invalid post slug')
  }

  return normalized
}

function normalizePersonSlug(input: string) {
  const normalized = slugify(input)
  if (!normalized) {
    throw new Error('Invalid person slug')
  }
  return normalized
}

function normalizeDate(input: string) {
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date')
  }
  return parsed
}


export async function listPosts() {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()

  const posts = await prisma.post.findMany({
    select: {
      slug: true,
      title: true,
      date: true,
    },
    orderBy: { date: 'desc' },
  })

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString().slice(0, 10),
  }))
}

export async function getPostBySlug(postSlug: string) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const normalizedSlug = normalizePostSlug(postSlug)
  const post = await prisma.post.findUnique({
    where: { slug: normalizedSlug },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  return {
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString().slice(0, 10),
    summary: post.summary || '',
    image: post.image || '',
    tags: post.tags || [],
    content: post.content || '',
  }
}

export async function createPost(payload: PostPayload) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const postSlug = normalizePostSlug(payload.slug)
  const postDate = normalizeDate(payload.date)

  await prisma.post.create({
    data: {
      title: payload.title,
      slug: postSlug,
      date: postDate,
      summary: payload.summary || null,
      image: payload.image || null,
      tags: payload.tags || [],
      content: payload.content.trim(),
    },
  })

  return postSlug
}

export async function updatePost(currentSlug: string, payload: PostPayload) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const oldSlug = normalizePostSlug(currentSlug)
  const newSlug = normalizePostSlug(payload.slug)
  const postDate = normalizeDate(payload.date)

  await prisma.post.update({
    where: { slug: oldSlug },
    data: {
      title: payload.title,
      slug: newSlug,
      date: postDate,
      summary: payload.summary || null,
      image: payload.image || null,
      tags: payload.tags || [],
      content: payload.content.trim(),
    },
  })

  return newSlug
}

export async function deletePost(postSlug: string) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const normalizedSlug = normalizePostSlug(postSlug)
  await prisma.post.delete({ where: { slug: normalizedSlug } })
}

export async function listPersons() {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  return prisma.person.findMany({
    select: {
      slug: true,
      name: true,
      occupation: true,
      company: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function getPersonBySlug(personSlug: string) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const normalizedSlug = normalizePersonSlug(personSlug)
  const person = await prisma.person.findUnique({
    where: { slug: normalizedSlug },
  })

  if (!person) {
    throw new Error('Person not found')
  }

  return {
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
  }
}

export async function createPerson(payload: PersonPayload) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const personSlug = normalizePersonSlug(payload.slug)

  await prisma.person.create({
    data: {
      name: payload.name,
      slug: personSlug,
      occupation: payload.occupation || null,
      company: payload.company || null,
      email: payload.email || null,
      twitter: payload.twitter || null,
      linkedin: payload.linkedin || null,
      github: payload.github || null,
      avatar: payload.avatar || null,
      content: payload.content.trim(),
    },
  })

  return personSlug
}

export async function updatePerson(currentSlug: string, payload: PersonPayload) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const oldSlug = normalizePersonSlug(currentSlug)
  const newSlug = normalizePersonSlug(payload.slug)

  await prisma.person.update({
    where: { slug: oldSlug },
    data: {
      name: payload.name,
      slug: newSlug,
      occupation: payload.occupation || null,
      company: payload.company || null,
      email: payload.email || null,
      twitter: payload.twitter || null,
      linkedin: payload.linkedin || null,
      github: payload.github || null,
      avatar: payload.avatar || null,
      content: payload.content.trim(),
    },
  })

  return newSlug
}

export async function deletePerson(personSlug: string) {
  assertDatabaseConfigured()
  const prisma = getPrismaClient()
  const normalizedSlug = normalizePersonSlug(personSlug)
  await prisma.person.delete({ where: { slug: normalizedSlug } })
}
