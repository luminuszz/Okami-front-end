import './global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'

import { queryClient } from './lib/react-query'
import { router } from './routes'
import { currentThemeAtom } from './store/theme'

export function App() {
  const theme = useAtomValue(currentThemeAtom)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <HelmetProvider>
        <Helmet titleTemplate="%s | Okami" />
        <RouterProvider router={router} />
      </HelmetProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
