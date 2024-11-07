import { AxiosError } from 'axios'

import { refreshTokenCall } from '@/api/refresh-token'
import { isUnauthorizedError, okamiHttpGateway } from '@/lib/axios'
import { storageService } from '@/lib/storage'

let isRefreshing = false

type FailRequestQueue = {
  onSuccess: () => void
  onFailure: (error: AxiosError) => void
}[]

const failRequestQueue: FailRequestQueue = []

export const refreshLocalNmIdSessaoToken = (error: AxiosError) => {
  const refreshToken = storageService.get('okami-refresh-token')

  if (isUnauthorizedError(error) && refreshToken) {
    const originalRequestCommand = error.config

    if (!isRefreshing) {
      isRefreshing = true
    }

    refreshTokenCall(refreshToken)
      .then(() => {
        failRequestQueue.forEach((request) => {
          request.onSuccess()
        })
      })
      .catch((error) => {
        failRequestQueue.forEach((request) => {
          request.onFailure(error)
        })
      })

    return new Promise((resolve, reject) => {
      failRequestQueue.push({
        onSuccess: () => {
          if (!originalRequestCommand?.headers) return

          resolve(okamiHttpGateway(originalRequestCommand))
        },

        onFailure: (error) => {
          reject(error)
        },
      })
    })
  }

  return Promise.reject(error)
}
