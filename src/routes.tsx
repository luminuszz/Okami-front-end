import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './components/layouts/app'
import { AuthLayout } from './components/layouts/auth'
import { Dashboard } from './pages/app/dashboard'
import { Signin } from './pages/auth/signin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{ path: '/', element: <Dashboard /> }],
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    children: [{ path: '/auth/sign-in', element: <Signin /> }],
  },
])
