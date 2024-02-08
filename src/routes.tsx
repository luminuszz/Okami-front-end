import { createBrowserRouter, redirect } from 'react-router-dom'

import { AppLayout } from './components/layouts/app'
import { AuthLayout } from './components/layouts/auth'
import { LocalStorageKeys } from './lib/utils'
import { NotFound } from './pages/404'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,

    loader: (page) => {
      const haveToken = localStorage.getItem(LocalStorageKeys.token)

      if (!haveToken) {
        return redirect('/auth/sign-in')
      }

      return page
    },
    children: [
      {
        path: '/',
        lazy: async () => {
          const { Dashboard } = await import('./pages/app/dashboard/dashboard')

          return {
            element: <Dashboard />,
          }
        },
      },
      {
        path: '/works',
        lazy: async () => {
          const { Works } = await import('./pages/app/works/works')
          return {
            element: <Works />,
          }
        },
      },
    ],
  },

  {
    path: '/auth',
    errorElement: <NotFound />,
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/sign-in',
        lazy: async () => {
          const { Signin } = await import('./pages/auth/signin')
          return {
            element: <Signin />,
          }
        },
      },
    ],
  },
])
