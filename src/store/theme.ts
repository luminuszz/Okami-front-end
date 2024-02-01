import { atomWithStorage } from 'jotai/utils'

type Theme = 'dark' | 'light'

export const currentThemeAtom = atomWithStorage<Theme>(
  '@okami-web:theme',
  'dark',
)
