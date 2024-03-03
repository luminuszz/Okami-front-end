import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isUnauthorizedError, okamiHttpGateway } from '@/lib/axios'
import { serviceWorkNotificationManager } from '@/lib/notifications'
import { BroadCastEvents } from '@/lib/utils'

import { Header } from '../header'
import { PermissionsProvider } from '../permissions-provider'

serviceWorkNotificationManager.registerServiceWorker()

const channel = new BroadcastChannel('service-worker-events')

export function AppLayout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const interceptorId = okamiHttpGateway.interceptors.response.use(
      (response) => response,
      (error) => {
        const canRedirectToLogin = isUnauthorizedError(error)

        if (canRedirectToLogin) {
          navigate('/auth/sign-in', { replace: true })
        }

        return Promise.reject(error)
      },
    )

    return () => {
      okamiHttpGateway.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  useEffect(() => {
    channel.onmessage = ({ data }) => {
      if (data.type === BroadCastEvents.newChapterAvailable) {
        queryClient.invalidateQueries({
          queryKey: ['works', 'unread', 'scrappingReport'],
        })
      }
    }

    return () => {
      channel.onmessage = null
    }
  }, [queryClient])

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
