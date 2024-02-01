import './global.css'

import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { router } from './routes'
import { currentThemeAtom } from './store/theme'

export function App() {
  const queryClient = new QueryClient()

  const theme = useAtomValue(currentThemeAtom)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster richColors />
      <HelmetProvider>
        <Helmet titleTemplate="%s | Okami" />
        <RouterProvider router={router} />
      </HelmetProvider>
    </QueryClientProvider>
  )
}
