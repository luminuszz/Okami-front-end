import { atomWithStorage } from 'jotai/utils'

import { LocalStorageKeys } from '@/lib/utils'

type Theme = 'dark' | 'light'

export const currentThemeAtom = atomWithStorage<Theme>(
  LocalStorageKeys.theme,
  'dark',
)
