export const MAX_SIZE_BYTES = 10 * 1024 * 1024
export const ALLOWED_TYPES = ['pdf', 'docx', 'doc', 'pptx', 'xlsx', 'md', 'txt', 'png', 'jpeg', 'jpg']

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  md: 'text/markdown',
  txt: 'text/plain',
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
}
