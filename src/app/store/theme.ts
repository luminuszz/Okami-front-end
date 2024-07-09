import { atomWithStorage } from 'jotai/utils'

import { LocalStorageKeys } from '@/utils/helpers.ts'

type Theme = 'dark' | 'light'

export const currentThemeAtom = atomWithStorage<Theme>(
  LocalStorageKeys.theme,
  'dark',
)
