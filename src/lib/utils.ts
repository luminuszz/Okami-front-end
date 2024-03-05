import { type ClassValue, clsx } from 'clsx'
import { formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum LocalStorageKeys {
  theme = '@okami-web:theme',
}

export const BroadCastEvents = {
  newChapterAvailable: 'new-chapter-available',
} as const

export type BroadCastEvent = keyof typeof BroadCastEvents

export const parseDistanceByDate = (date: Date | string) => {
  const dateToParse = typeof date === 'string' ? parseISO(date) : date

  const now = new Date()

  return formatDistance(dateToParse, now, {
    addSuffix: true,
    includeSeconds: true,
    locale: ptBR,
  })
}

export const acceptFileTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/blob',
]

export const validateFileType = (data: FileList | File) => {
  return acceptFileTypes.includes(
    data instanceof FileList ? data?.[0]?.type : data?.type,
  )
}

export const getDefaultImageFile = async () => {
  const response = await fetch('/animes-default.jpg')

  const blob = await response.blob()

  return new File([blob], 'animes-default.jpg', { type: 'image/jpeg' })
}

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isFileList = (value: unknown): value is FileList =>
  value instanceof FileList
