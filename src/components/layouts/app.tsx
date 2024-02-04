import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isUnauthorizedError, okamiHttpGateway } from '@/lib/axios'
import { LocalStorageKeys } from '@/lib/utils'

import { Header } from '../header'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptorId = okamiHttpGateway.interceptors.response.use(
      (response) => response,
      (error) => {
        const canRedirectToLogin = isUnauthorizedError(error)

        if (canRedirectToLogin) {
          localStorage.removeItem(LocalStorageKeys.token)
          navigate('/auth/sign-in', { replace: true })
        }
      },
    )

    return () => {
      okamiHttpGateway.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
