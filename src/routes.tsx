import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'

import { AppLayout } from './components/layouts/app'
import { AuthLayout } from './components/layouts/auth'
import { LocalStorageKeys } from './lib/utils'
import { NotFound } from './pages/404'
import { Signin } from './pages/auth/signin'

const Works = lazy(() => import('./pages/app/works/works'))
const Dashboard = lazy(() => import('./pages/app/dashboard/dashboard'))

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
      { path: '/', element: <Dashboard /> },
      { path: '/works', element: <Works /> },
    ],
  },

  {
    path: '/auth',
    errorElement: <NotFound />,
    element: <AuthLayout />,
    children: [{ path: '/auth/sign-in', element: <Signin /> }],
  },
])
