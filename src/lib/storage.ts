export const LOCAL_STORAGE_KEYS = {
  'okami-refresh-token': 'okami-web@refresh-token',
} as const

export type LocalStorageKeys = typeof LOCAL_STORAGE_KEYS

const storageService = {
  get(key: keyof LocalStorageKeys) {
    return localStorage.getItem(LOCAL_STORAGE_KEYS[key])
  },

  set(key: keyof LocalStorageKeys, value: string) {
    localStorage.setItem(LOCAL_STORAGE_KEYS[key], value)
  },

  delete(key: keyof LocalStorageKeys) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS[key])
  },
}

export { storageService }
