import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { slug as slugify } from 'github-slugger'

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')
const AUTHORS_DIR = path.join(process.cwd(), 'data', 'authors')

type PostPayload = {
  title: string
  slug: string
  date: string
  summary?: string
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

async function listMdxFiles(baseDir: string): Promise<string[]> {
  const entries = await fs.readdir(baseDir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(baseDir, entry.name)
      if (entry.isDirectory()) {
        return listMdxFiles(entryPath)
      }
      return entry.name.endsWith('.mdx') ? [entryPath] : []
    })
  )
  return files.flat()
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
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

function createMdxFile(content: string, data: Record<string, unknown>) {
  return matter.stringify(content.trim(), data).trimEnd() + '\n'
}

function buildPostFilePath(postSlug: string) {
  const normalizedSlug = normalizePostSlug(postSlug)
  return path.join(BLOG_DIR, `${normalizedSlug}.mdx`)
}

function buildPersonFilePath(personSlug: string) {
  const normalizedSlug = normalizePersonSlug(personSlug)
  return path.join(AUTHORS_DIR, `${normalizedSlug}.mdx`)
}

export async function listPosts() {
  const files = await listMdxFiles(BLOG_DIR)
  const posts = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = await fs.readFile(filePath, 'utf8')
      const parsed = matter(fileContent)
      const slug = path.relative(BLOG_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx$/, '')

      return {
        slug,
        title: String(parsed.data.title || slug),
        date: String(parsed.data.date || ''),
      }
    })
  )

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(postSlug: string) {
  const filePath = buildPostFilePath(postSlug)
  const fileContent = await fs.readFile(filePath, 'utf8')
  const parsed = matter(fileContent)

  return {
    slug: normalizePostSlug(postSlug),
    title: String(parsed.data.title || ''),
    date: String(parsed.data.date || ''),
    summary: String(parsed.data.summary || ''),
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
    content: parsed.content.trim(),
  }
}

export async function createPost(payload: PostPayload) {
  const postSlug = normalizePostSlug(payload.slug)
  const filePath = buildPostFilePath(postSlug)
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  if (await fileExists(filePath)) {
    throw new Error('Post already exists')
  }

  const fileData: Record<string, unknown> = {
    title: payload.title,
    date: payload.date,
  }

  if (payload.summary) fileData.summary = payload.summary
  if (payload.tags && payload.tags.length > 0) fileData.tags = payload.tags

  await fs.writeFile(filePath, createMdxFile(payload.content, fileData), 'utf8')
  return postSlug
}

export async function updatePost(currentSlug: string, payload: PostPayload) {
  const oldPath = buildPostFilePath(currentSlug)
  const newSlug = normalizePostSlug(payload.slug)
  const newPath = buildPostFilePath(newSlug)
  await fs.mkdir(path.dirname(newPath), { recursive: true })
  const oldNormalizedSlug = normalizePostSlug(currentSlug)

  if (newSlug !== oldNormalizedSlug && (await fileExists(newPath))) {
    throw new Error('Post already exists')
  }

  const fileData: Record<string, unknown> = {
    title: payload.title,
    date: payload.date,
  }

  if (payload.summary) fileData.summary = payload.summary
  if (payload.tags && payload.tags.length > 0) fileData.tags = payload.tags

  if (oldPath !== newPath) {
    await fs.rename(oldPath, newPath)
  }

  await fs.writeFile(newPath, createMdxFile(payload.content, fileData), 'utf8')
  return newSlug
}

export async function deletePost(postSlug: string) {
  const filePath = buildPostFilePath(postSlug)
  await fs.unlink(filePath)
}

export async function listPersons() {
  const files = await listMdxFiles(AUTHORS_DIR)
  const people = await Promise.all(
    files.map(async (filePath) => {
      const fileContent = await fs.readFile(filePath, 'utf8')
      const parsed = matter(fileContent)
      const slug = path.basename(filePath, '.mdx')

      return {
        slug,
        name: String(parsed.data.name || slug),
        occupation: String(parsed.data.occupation || ''),
        company: String(parsed.data.company || ''),
      }
    })
  )

  return people.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getPersonBySlug(personSlug: string) {
  const normalizedSlug = normalizePersonSlug(personSlug)
  const filePath = buildPersonFilePath(normalizedSlug)
  const fileContent = await fs.readFile(filePath, 'utf8')
  const parsed = matter(fileContent)

  return {
    slug: normalizedSlug,
    name: String(parsed.data.name || ''),
    occupation: String(parsed.data.occupation || ''),
    company: String(parsed.data.company || ''),
    email: String(parsed.data.email || ''),
    twitter: String(parsed.data.twitter || ''),
    linkedin: String(parsed.data.linkedin || ''),
    github: String(parsed.data.github || ''),
    avatar: String(parsed.data.avatar || ''),
    content: parsed.content.trim(),
  }
}

export async function createPerson(payload: PersonPayload) {
  const personSlug = normalizePersonSlug(payload.slug)
  const filePath = buildPersonFilePath(personSlug)

  if (await fileExists(filePath)) {
    throw new Error('Person already exists')
  }

  const fileData: Record<string, unknown> = {
    name: payload.name,
  }

  if (payload.avatar) fileData.avatar = payload.avatar
  if (payload.occupation) fileData.occupation = payload.occupation
  if (payload.company) fileData.company = payload.company
  if (payload.email) fileData.email = payload.email
  if (payload.twitter) fileData.twitter = payload.twitter
  if (payload.linkedin) fileData.linkedin = payload.linkedin
  if (payload.github) fileData.github = payload.github

  await fs.writeFile(filePath, createMdxFile(payload.content, fileData), 'utf8')
  return personSlug
}

export async function updatePerson(currentSlug: string, payload: PersonPayload) {
  const oldPath = buildPersonFilePath(currentSlug)
  const newSlug = normalizePersonSlug(payload.slug)
  const newPath = buildPersonFilePath(newSlug)
  const oldNormalizedSlug = normalizePersonSlug(currentSlug)

  if (newSlug !== oldNormalizedSlug && (await fileExists(newPath))) {
    throw new Error('Person already exists')
  }

  const fileData: Record<string, unknown> = {
    name: payload.name,
  }

  if (payload.avatar) fileData.avatar = payload.avatar
  if (payload.occupation) fileData.occupation = payload.occupation
  if (payload.company) fileData.company = payload.company
  if (payload.email) fileData.email = payload.email
  if (payload.twitter) fileData.twitter = payload.twitter
  if (payload.linkedin) fileData.linkedin = payload.linkedin
  if (payload.github) fileData.github = payload.github

  if (oldPath !== newPath) {
    await fs.rename(oldPath, newPath)
  }

  await fs.writeFile(newPath, createMdxFile(payload.content, fileData), 'utf8')
  return newSlug
}

export async function deletePerson(personSlug: string) {
  const filePath = buildPersonFilePath(personSlug)
  await fs.unlink(filePath)
}
