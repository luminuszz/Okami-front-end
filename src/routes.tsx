import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './components/layouts/app'
import { AuthLayout } from './components/layouts/auth'
import { NotFound } from './pages/404'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { ScrappingReport } from './pages/app/scrapping-report/scrapping-report'
import { Works } from './pages/app/works/works'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,

    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/works',
        element: <Works />,
      },
      {
        path: '/scrapping-report',
        element: <ScrappingReport />,
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
