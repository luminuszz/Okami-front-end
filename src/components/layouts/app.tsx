import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { refreshTokenCall } from '@/api/refresh-token'
import { isUnauthorizedError, okamiHttpGateway } from '@/lib/axios'
import { serviceWorkNotificationManager } from '@/lib/notifications'
import { storageService } from '@/lib/storage'

import { Header } from '../header'
import { PermissionsProvider } from '../permissions-provider'

let isRefreshing = false

type FailRequestQueue = {
  onSuccess: () => void
  onFailure: (error: AxiosError) => void
}[]

const failRequestQueue: FailRequestQueue = []

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    serviceWorkNotificationManager.checkPermissions().then((isGranted) => {
      if (!isGranted) {
        serviceWorkNotificationManager.requestNotifications()
      }
    })
  }, [])

  useEffect(() => {
    const interceptorId = okamiHttpGateway.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (isUnauthorizedError(error)) {
          const refreshToken = storageService.get('okami-refresh-token')

          if (!refreshToken) {
            navigate('/auth/sign-in', { replace: true })
            return Promise.reject(error)
          }

          if (!isRefreshing) {
            isRefreshing = true

            refreshTokenCall(refreshToken)
              .then(() => {
                console.log('refresh token')

                failRequestQueue.forEach((request) => {
                  request.onSuccess()
                })
              })
              .catch((error) => {
                failRequestQueue.forEach((request) => {
                  request.onFailure(error)
                })
                navigate('/auth/sign-in', { replace: true })
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failRequestQueue.push({
              onFailure: (error) => reject(error),
              onSuccess: () => {
                resolve(null)
              },
            })
          })
        }

        return Promise.reject(error)
      },
    )

    return () => {
      okamiHttpGateway.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <PermissionsProvider>
      <div className="flex min-h-screen flex-col antialiased">
        <Header />

        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
          <Outlet />
        </div>
      </div>
    </PermissionsProvider>
  )
}
