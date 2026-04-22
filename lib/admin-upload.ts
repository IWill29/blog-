import { promises as fs } from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'static', 'images', 'uploads')

function sanitizeFilename(fileName: string) {
  const parsed = path.parse(fileName)
  const base = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const extension = (parsed.ext || '').toLowerCase()

  return {
    base: base || 'image',
    extension: extension || '.jpg',
  }
}

export async function resolvePostImageValue({
  formData,
  currentImage = '',
}: {
  formData: FormData
  currentImage?: string
}) {
  const removeImage = String(formData.get('removeImage') || '') === 'on'
  if (removeImage) {
    return ''
  }

  const imageInput = String(formData.get('image') || '').trim()
  const file = formData.get('imageFile')

  if (file instanceof File && file.size > 0) {
    return saveUploadedImage(file)
  }

  if (imageInput) {
    return imageInput
  }

  return currentImage
}

export async function resolvePersonAvatarValue({
  formData,
  currentAvatar = '',
}: {
  formData: FormData
  currentAvatar?: string
}) {
  const removeAvatar = String(formData.get('removeAvatar') || '') === 'on'
  if (removeAvatar) {
    return ''
  }

  const avatarInput = String(formData.get('avatar') || '').trim()
  const file = formData.get('avatarFile')

  if (file instanceof File && file.size > 0) {
    return saveUploadedImage(file)
  }

  if (avatarInput) {
    return avatarInput
  }

  return currentAvatar
}

async function saveUploadedImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid image type')
  }

  const { base, extension } = sanitizeFilename(file.name)
  const fileName = `${Date.now()}-${base}${extension}`
  const filePath = path.join(UPLOAD_DIR, fileName)
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(filePath, fileBuffer)

  return `/static/images/uploads/${fileName}`
}
