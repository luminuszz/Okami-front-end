import { type ClassValue, clsx } from 'clsx'
import { formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum LocalStorageKeys {
  token = '@okami-web:token',
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
