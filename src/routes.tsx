import { createBrowserRouter, redirect } from 'react-router-dom'

import { AppLayout } from './components/layouts/app'
import { AuthLayout } from './components/layouts/auth'
import { LocalStorageKeys } from './lib/utils'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { Works } from './pages/app/works/works'
import { Signin } from './pages/auth/signin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    loader: (page) => {
      const haveToken = localStorage.getItem(LocalStorageKeys.token)

      if (!haveToken) {
        return redirect('/auth/sign-in')
      }

      return page
    },
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/works', element: <Works /> },
    ],
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [{ path: '/auth/sign-in', element: <Signin /> }],
  },
])
