import { atomWithStorage } from 'jotai/utils'

import { LocalStorageKeys } from '@/utils/helpers.ts'

export type Theme = 'dark' | 'light'

export const currentThemeAtom = atomWithStorage<Theme>(
  LocalStorageKeys.theme,
  'dark',
)
