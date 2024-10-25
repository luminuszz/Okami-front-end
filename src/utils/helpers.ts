import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { type ClassValue, clsx } from 'clsx'
import { compareDesc, formatDistance, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { differenceBy } from 'lodash'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import { queryClient } from '@/lib/react-query.ts'

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

const mediaTypes = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const

export function useMediaQuery(media: keyof typeof mediaTypes) {
  const [mediaMatch, setMediaMatch] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(mediaTypes[media])

    setMediaMatch(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMediaMatch(!e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [media])

  return mediaMatch
}

export function parsePageQuery(value: unknown = '1') {
  return z.coerce
    .number()
    .transform((value) => (value > 0 ? value - 1 : 0))
    .parse(value)
}

export type ColorKey = keyof typeof colors

export function getAvailableTagColors() {
  const excludeColors = ['black', 'white', 'transparent', 'inherit', 'current']

  return differenceBy(Object.keys(colors), excludeColors) as [ColorKey]
}

export function useGetCurrentPage(customParamKey = 'page') {
  const [params] = useSearchParams()

  return parsePageQuery(params.get(customParamKey))
}

export const getTagColor = (color: ColorKey | string) => {
  return colors[color as keyof typeof colors]?.[600] ?? colors.gray[600]
}

export function useDebounceState<T>(
  initialValue: T,
  delay: number,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return [debouncedValue, setValue]
}

export const normalizeString = (value: string) => value.trim().normalize('NFC')

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'

type ValueOrFalsy<Type> = Type | null | undefined

type UpdateCacheHandler<CacheType> = (cache: CacheType) => CacheType

type UpdateCacheParam<CacheType> = CacheType | UpdateCacheHandler<CacheType>

export function useUpdateQueryCache<CacheType>(key: QueryKey) {
  const client = useQueryClient()

  function updateCache(resolve: UpdateCacheParam<ValueOrFalsy<CacheType>>) {
    const originalCache = queryClient.getQueryData<CacheType>(key) ?? null

    client.setQueryData(
      key,
      isFunction(resolve) ? resolve(originalCache) : resolve,
    )

    return originalCache
  }

  return updateCache
}

export function convertAndCompareDescendingDates<T extends string>(a: T, b: T) {
  return compareDesc(parseISO(a), parseISO(b))
}
